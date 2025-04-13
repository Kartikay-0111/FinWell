from math import sin, cos, pi
import numpy as np
import json
from datetime import datetime  # Import datetime module
import faiss

class PredictModel:
    def __init__(self):
        self.file_names = ["food_transactions.json", "grocery_transactions.json", "travel_vacation_transactions.json", "transport_transactions.json", "investment_transactions_with_day.json", "fashion_transactions.json", "healthcare_transactions.json", "online_shopping_transactions.json"]
        self.X = []  # list of vectors
        self.y = []  # list of categories
        for file_name in self.file_names:
            with open("C:/GithubRepos/finwell-dashboard-glow/server/sample/" + file_name, 'r') as f:
                dataset = json.load(f)
                
                # print(type(dataset))
                for txn in dataset:
                    vec = self.encode_amount_time(txn['Debit'], txn['Timestamp'], txn['Day'])
                    self.X.append(vec)
                    self.y.append(file_name.split("_")[0])  # K

        self.X_np = np.array(self.X).astype('float32')
        self.index = faiss.IndexFlatL2(self.X_np.shape[1])  # L2 similarity
        self.index.add(self.X_np)  # Store vectors
        self.categories = np.array(self.y)
    
    def add_transaction(self, amount, timestamp, day, category):
         # Encode the transaction
        encoded_vector = self.encode_amount_time(amount, timestamp, day).astype('float32')

        # Add the encoded vector to the FAISS index
        self.index.add(encoded_vector.reshape(1, -1))  # Reshape to match FAISS input format

        # Add the category to the categories list
        self.categories = np.append(self.categories, category)

        print(f"Transaction added: Amount={amount}, Timestamp={timestamp}, Day={day}, Category={category}")

    def encode_amount_time(self, amount, timestamp, day):
        time_obj = datetime.strptime(timestamp, "%H:%M")  # Format matches "18:37"
        hour = time_obj.hour + time_obj.minute / 60.0

        # Convert day name to index (0-6)
        days = {'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
                'Thursday': 4, 'Friday': 5, 'Saturday': 6}
        day_index = days[day]

        # Cyclical encoding for hour and day
        hour_sin = sin(2 * pi * hour / 24)
        hour_cos = cos(2 * pi * hour / 24)
        day_sin = sin(2 * pi * day_index / 7)
        day_cos = cos(2 * pi * day_index / 7)

        return np.array([amount, hour_sin, hour_cos, day_sin, day_cos])

    def query(self, amount, timestamp, day, k=5):
        query_vec = self.encode_amount_time(amount, timestamp, day).astype('float32').reshape(1, -1)
        D, I = self.index.search(query_vec, k=5)  # top-5 matches

        top_categories = self.categories[I[0]]  # Most similar categories
        predicted_category = top_categories[0]  # Get the category of the most similar transaction

        # Convert distances to relevancy scores (0 to 1, where 1 is most relevant)
        max_distance = np.max(D)
        relevancy_scores = 1 - (D / max_distance)  # Normalize and invert distances

        print("Relevancy Scores:", relevancy_scores[0][0]*100)
        print("Predicted category:", predicted_category)
        print("----------------------------------")

        return (predicted_category, relevancy_scores[0][0]*100)



# amount = 300
# timestamp = "19:50"
# day = "Monday"  # Example day
# query_vec = encode_amount_time(amount, timestamp, day).astype('float32').reshape(1, -1)
# D, I = index.search(query_vec, k=5)  # top-5 matches

# top_categories = categories[I[0]]  # Most similar categories
# predicted_category = top_categories[0]  # Get the category of the most similar transaction

# # Convert distances to relevancy scores (0 to 1, where 1 is most relevant)
# max_distance = np.max(D)
# relevancy_scores = 1 - (D / max_distance)  # Normalize and invert distances

# print("Relevancy Scores:", relevancy_scores[0][0]*100)
# print("----------------------------------")
# print("Predicted category:", predicted_category)