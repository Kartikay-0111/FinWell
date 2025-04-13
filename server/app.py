from collections import defaultdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model import PredictModel
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
import pandas as pd
import os
import re
from datetime import datetime
from supabase import create_client, Client
from dotenv import dotenv_values

# Loading the config File
config = dotenv_values('.env')

# Load Supabase credentials from environment variables
SUPABASE_URL = config.get("SUPABASE_URL")
SUPABASE_KEY = config.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

GLOBAL_UPI_MAPPING = defaultdict(int)

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE"])

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Generating Prediction Model
predict_model = PredictModel()

# Define the expected headers. Uncomment when dummy data is sent
expected_headers = [
    "Timestamp",
    "Date",
    "Transaction Reference",
    "Ref.No./Chq.No.",
    "Credit",
    "Debit",
    "Balance"
]

# Create the upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to normalize and compare headers
def headers_match(extracted_headers, expected_headers):
    # Remove None values and normalize headers: strip whitespace and convert to lowercase
    extracted = [str(h).strip().lower() for h in extracted_headers if h is not None]
    expected = [h.strip().lower() for h in expected_headers]
    print(extracted)
    print(expected_headers)
    return extracted == expected

# Returns True only if there are NO alphabetic characters in the string
def is_non_alpha_string(text):
    return not re.search(r'[A-Za-z]', text)

# Maps Date to a day for prediction model
def map_date_to_day(date_str):
    try:
        # Parse the date string, assuming 'YY' represents the 21st century (20xx)
        day, month, year_short = date_str.split('/')
        year = 2000 + int(year_short)  # Assuming 21st century

        date_object = datetime(year, int(month), int(day))
        return date_object.strftime("%A")  # "%A" gives the full weekday name

    except ValueError:
        try:
            # Try parsing assuming 'YY' represents the 20th century (19xx)
            day, month, year_short = date_str.split('-')
            year = 1900 + int(year_short)

            date_object = datetime(year, int(month), int(day))
            return date_object.strftime("%A")
        except ValueError:
            return None  # Invalid date format

# This function is used to extract data from pdf which is stored in '/uploads/bank2.pdf'
async def extract_pdf(filename):
    try:
        print(f"Extract PDF function is called")
        # Open the PDF document
        doc = fitz.open(filename=filename)
        transactions = []
        # Iterate through each page
        for page_num, page in enumerate(doc, start=1):
            # Detect tables on the page
            tables = page.find_tables()
            
            # Check if any tables are found
            if tables.tables:
                print(f"Page {page_num}: {len(tables.tables)} table(s) found.")
                
                # Extract and process each table
                for idx, table in enumerate(tables.tables, start=1):
                    data = table.extract()
                    if not data:
                        continue  # Skip if table data is empty
                    
                    # Check if the first row matches the expected headers
                    if headers_match(data[0], expected_headers):
                        df = pd.DataFrame(data[1:], columns=data[0])  # Use first row as header
                        # print(f"\nMatching Table {idx} on Page {page_num}:\n", df)
                        for index, row in df.iterrows():
                            # print(row)
                            # print(f"{index} {row['Date']}")

                            if is_non_alpha_string(row['Date']):
                                record = {}
                                try:
                                    # Uncomment when dummy pdf is sent
                                    record['Timestamp'] = row['Timestamp']
                                    record['Date'] = row['Date'] 
                                    record['Credit'] = row['Credit'] if row['Credit'] != '-' else None
                                    record['Debit'] = row['Debit'] if row['Debit'] != '-' else None
                                    record['Balance'] = row['Balance']

                                    # Breaking Down transaction details
                                    desc = row['Transaction Reference'].split("/")
                                    # print(desc)
                                    record['Mode'] = desc[0]
                                    record['UPI_ID'] = desc[2]
                                    record['To_Name'] = desc[3]
                                    record['To_Bank'] = desc[4]
                                    record['To_Upi_Id'] = desc[5]
                                    transactions.append(record)
                                except:
                                    pass   
                    else:
                        print(f"Table {idx} on Page {page_num} does not match the expected headers.")
                        pass
            else:
                print(f"Page {page_num}: No tables found.")
                pass

        print("Fucntion reached till here")
        val = await predict(transactions)
        return True
        # Define the filename for the CSV
        # csv_filename = f"page_{page_num}_table_{idx}.csv"
        # csv_path = os.path.join(output_dir, csv_filename)
        
        # # Save the DataFrame to a CSV file
        # df.to_csv(csv_path, index=False)
    except Exception as e:
        raise Exception(f"An internal error: ${e}")

# This function takes a list of docs and predits and adds category to them using user embeddings
async def predict(data):
    # Iterate through the list and predict the category and relevance score of the user trasnsaction
    print(f"Function reached here till prediction model")
    # print(data)
    try:
        for trans in data:
            print(trans)
            # Before Querying to Vectoe Strore check if we have it in our Custom Global Mapping
            if GLOBAL_UPI_MAPPING[trans['To_Upi_Id']] != 0:
                print(f"Cache hit for -> {trans}")
                trans['Category'] = GLOBAL_UPI_MAPPING[trans['To_Upi_Id']]
                trans['Score'] = 1.0
            else:
                # Mapping date to day
                day = map_date_to_day(trans['Date'])
                amt = float(trans['Debit'])
                time = trans['Timestamp']
                cat, score = predict_model.query(timestamp= time, amount=amt, day=day)
                print(f"For data -> {trans}")
                print(f"We predicted -> {cat} with {score}")

                # Adding embedding to our database if score >= 0.85
                if score >= 95.00:
                    print(f"Adding to our Embeddings model")
                    predict_model.add_transaction(timestamp=time, amount=amt, day=day, category=cat)

                # Directly adding to our cache if score >= 0.90
                if score >= 90.00:
                    print(f"Inserting in Cache {trans['To_Upi_Id']} -> {cat}")
                    GLOBAL_UPI_MAPPING[trans['To_Upi_Id']] = cat

                trans['Category'] = cat
                trans['Score'] = float(score)

        val = await upload_data(data)

        return True
    
    except Exception as e:
        raise Exception(f"${e} in predict.")

# This function writes the data to the supabase table
# It takes a list of documents
async def upload_data(data):
    try:
        response = await supabase.table('upi_transactions').insert(data).execute()
        if response.error:
            print(f"Error uploading documents: {response.error}")
            raise Exception(response.error)
        else:
            print(f"Successfully uploaded {len(response.data)} documents.")
            # response.data will contain the inserted rows (if the table has RETURNING set)
            print("Uploaded data:", response.data)
            return True
    except Exception as e:
        raise Exception(e)


@app.route('/upload_pdf', methods=['POST'])
async def upload_pdf():
    """Handles the POST request to upload a PDF file."""
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['pdf_file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        # Call the function which extracts the pdf file content

        try:
            await extract_pdf(filepath) 
        except Exception as e:
            return jsonify({'message': f'The following error encountered ${e}'})

        return jsonify({'message': 'PDF file uploaded successfully'}), 201
        # return jsonify({'message': 'PDF file uploaded successfully', 'filename': filename, 'filepath': filepath}), 201
    else:
        return jsonify({'error': 'Invalid file type. Only PDF files are allowed'}), 400

if __name__ == '__main__':
    app.run(debug=True)