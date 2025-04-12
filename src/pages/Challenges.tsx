
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Award, GraduationCap, BadgeCheck, Target, CheckCircle2, Clock, Plus } from "lucide-react";
import { mockDataService, Challenge, Badge as BadgeType } from "@/services/mockData";

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const startDate = new Date(challenge.startDate).toLocaleDateString();
  const endDate = new Date(challenge.endDate).toLocaleDateString();

  return (
    <Card className={`fin-card fin-hover-scale ${challenge.completed ? 'border-green-500/30' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-finWhite">{challenge.title}</CardTitle>
            <CardDescription className="text-finLightGray">
              {startDate} - {endDate}
            </CardDescription>
          </div>
          {challenge.completed ? (
            <Badge className="bg-green-900/20 text-green-500 border-green-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
            </Badge>
          ) : (
            <Badge className="bg-finOrange/10 text-finOrange border-finOrange/30">
              <Clock className="h-3 w-3 mr-1" /> In Progress
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-finLightGray text-sm">{challenge.description}</p>
        <div>
          <div className="flex justify-between text-sm text-finLightGray mb-1">
            <span>Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <Progress value={challenge.progress} className="h-2 bg-finDarkBlue" />
        </div>
        <div className="flex items-center text-sm text-finLightGray">
          <Trophy className="h-4 w-4 mr-1 text-finOrange" />
          <span>Reward: {challenge.reward}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-finOrange/10 text-finOrange hover:bg-finOrange/20 border border-finOrange/30">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const BadgeCard = ({ badge }: { badge: BadgeType }) => {
  const isUnlocked = !!badge.unlockedAt;
  const unlockedDate = isUnlocked ? new Date(badge.unlockedAt!).toLocaleDateString() : null;

  // Badge icon mapping
  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case "Award":
        return <Award className="h-6 w-6" />;
      case "Trophy":
        return <Trophy className="h-6 w-6" />;
      case "Target":
        return <Target className="h-6 w-6" />;
      case "BadgeCheck":
        return <BadgeCheck className="h-6 w-6" />;
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  return (
    <Card className={`fin-card fin-hover-scale ${isUnlocked ? 'border-finOrange/30' : 'opacity-60'}`}>
      <CardContent className="pt-6 pb-4 text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
          isUnlocked ? 'bg-finOrange/20 text-finOrange' : 'bg-finDarkBlue/60 text-finLightGray/60'
        }`}>
          {getBadgeIcon(badge.icon)}
        </div>
        <h3 className="font-medium text-finWhite mb-1">{badge.name}</h3>
        <p className="text-finLightGray text-sm mb-3">{badge.description}</p>
        {isUnlocked ? (
          <Badge className="bg-finOrange/10 text-finOrange border-finOrange/30">
            Unlocked: {unlockedDate}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-finLightGray border-finLightGray/20">
            Locked
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);

  useEffect(() => {
    const challengesData = mockDataService.getChallenges();
    const badgesData = mockDataService.getBadges();
    setChallenges(challengesData);
    setBadges(badgesData);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-finWhite">Challenges & Achievements</h1>
          <p className="text-finLightGray">Complete challenges to earn badges and improve your finances</p>
        </div>
        <Button className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90">
          <Plus className="h-4 w-4 mr-2" /> Join Challenge
        </Button>
      </div>

      <Tabs defaultValue="challenges">
        <TabsList className="bg-finDarkBlue border border-finLightGray/20 mb-4">
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="challenges" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-0">
          <Card className="fin-card">
            <CardHeader>
              <CardTitle>Monthly Savers Leaderboard</CardTitle>
              <CardDescription className="text-finLightGray">
                Top savers in your community this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Rahul M.", points: 850, avatar: "" },
                  { rank: 2, name: "Priya S.", points: 720, avatar: "" },
                  { rank: 3, name: "Vikram J.", points: 680, avatar: "" },
                  { rank: 4, name: "Aisha J.", points: 645, avatar: "", isCurrent: true },
                  { rank: 5, name: "Rajesh K.", points: 610, avatar: "" },
                ].map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center p-3 rounded-lg ${
                      user.isCurrent ? 'bg-finOrange/10 border border-finOrange/30' : 'bg-finDarkBlue/50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-finOrange/20 flex items-center justify-center mr-3 text-finOrange font-bold">
                      {user.rank}
                    </div>
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-finDarkBlue/80 text-finWhite">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-medium ${user.isCurrent ? 'text-finOrange' : 'text-finWhite'}`}>
                        {user.name} {user.isCurrent && "(You)"}
                      </p>
                      <p className="text-xs text-finLightGray">Joined April 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-finWhite">{user.points}</p>
                      <p className="text-xs text-finLightGray">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
