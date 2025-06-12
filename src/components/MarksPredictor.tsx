
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSyllabus } from '@/contexts/SyllabusContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Target, Brain, AlertCircle } from 'lucide-react';

interface SubjectMarks {
  [subjectId: string]: number;
}

export const MarksPredictor = () => {
  const { subjects, getSubjectProgress } = useSyllabus();
  const { toast } = useToast();
  const [subjectMarks, setSubjectMarks] = useState<SubjectMarks>({});
  const [prediction, setPrediction] = useState<any>(null);

  const handleMarksChange = (subjectId: string, marks: string) => {
    const numMarks = parseInt(marks) || 0;
    if (numMarks > 100) {
      toast({
        title: "Invalid Marks",
        description: "Marks cannot exceed 100",
        variant: "destructive"
      });
      return;
    }
    setSubjectMarks(prev => ({ ...prev, [subjectId]: numMarks }));
  };

  const calculatePrediction = () => {
    const validSubjects = subjects.filter(subject => subjectMarks[subject.id] > 0);
    
    if (validSubjects.length === 0) {
      toast({
        title: "No Data",
        description: "Please enter marks for at least one subject",
        variant: "destructive"
      });
      return;
    }

    // Calculate weighted average considering syllabus completion
    let totalWeightedMarks = 0;
    let totalWeight = 0;
    const subjectAnalysis: any[] = [];

    validSubjects.forEach(subject => {
      const marks = subjectMarks[subject.id];
      const progress = getSubjectProgress(subject.id);
      const weight = progress / 100; // Weight based on syllabus completion
      
      totalWeightedMarks += marks * weight;
      totalWeight += weight;

      // Subject-specific analysis
      let recommendation = '';
      if (progress < 50) {
        recommendation = 'Focus on completing more chapters';
      } else if (marks < 60) {
        recommendation = 'Need more practice in this subject';
      } else if (marks >= 80 && progress >= 80) {
        recommendation = 'Excellent performance! Maintain this level';
      } else {
        recommendation = 'Good progress, keep working consistently';
      }

      subjectAnalysis.push({
        subject: subject.name,
        marks,
        progress,
        recommendation,
        icon: subject.icon
      });
    });

    const predictedPercentage = totalWeight > 0 ? Math.round(totalWeightedMarks / totalWeight) : 0;
    
    // Generate overall recommendations
    const overallRecommendations = [];
    
    if (predictedPercentage >= 90) {
      overallRecommendations.push("Outstanding performance! You're on track for excellent results.");
    } else if (predictedPercentage >= 75) {
      overallRecommendations.push("Great job! Focus on maintaining consistency across all subjects.");
    } else if (predictedPercentage >= 60) {
      overallRecommendations.push("Good progress. Identify weak areas and allocate more study time to them.");
    } else {
      overallRecommendations.push("You need to increase your study efforts. Consider seeking help from teachers.");
    }

    // Add subject-specific tips
    const weakSubjects = subjectAnalysis.filter(s => s.marks < 70 || s.progress < 60);
    if (weakSubjects.length > 0) {
      overallRecommendations.push(`Focus more on: ${weakSubjects.map(s => s.subject).join(', ')}`);
    }

    setPrediction({
      predictedPercentage,
      subjectAnalysis,
      overallRecommendations,
      confidence: Math.min(90, totalWeight * 100 / subjects.length)
    });

    toast({
      title: "Prediction Generated",
      description: `Predicted board exam percentage: ${predictedPercentage}%`,
    });
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (percentage: number) => {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 75) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <span>Board Marks Predictor</span>
        </h2>
        <p className="text-muted-foreground">Predict your board exam performance based on internal assessments</p>
      </div>

      {/* Input Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Enter Your Internal Exam Marks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject) => {
            const progress = getSubjectProgress(subject.id);
            return (
              <div key={subject.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm font-medium">
                    <span className="text-xl">{subject.icon}</span>
                    <span>{subject.name}</span>
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {progress}% syllabus completed
                  </Badge>
                </div>
                <Input
                  type="number"
                  placeholder="Enter marks (out of 100)"
                  value={subjectMarks[subject.id] || ''}
                  onChange={(e) => handleMarksChange(subject.id, e.target.value)}
                  max={100}
                  min={0}
                />
              </div>
            );
          })}
          
          <Button onClick={calculatePrediction} className="w-full mt-4">
            <Brain className="w-4 h-4 mr-2" />
            Predict Board Marks
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <div className="space-y-4">
          {/* Overall Prediction */}
          <Card className="glass-card border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Target className="w-6 h-6 text-primary" />
                <span>Predicted Board Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getPerformanceColor(prediction.predictedPercentage)}`}>
                {prediction.predictedPercentage}%
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="default" className="text-lg px-4 py-2">
                  Grade: {getPerformanceGrade(prediction.predictedPercentage)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {prediction.confidence.toFixed(0)}% confidence
                </Badge>
              </div>
              <Progress value={prediction.predictedPercentage} className="h-3" />
            </CardContent>
          </Card>

          {/* Subject Analysis */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Subject-wise Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prediction.subjectAnalysis.map((analysis: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{analysis.icon}</span>
                      <span className="font-medium">{analysis.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{analysis.marks}%</Badge>
                      <Badge variant="secondary">{analysis.progress}% complete</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>{analysis.recommendation}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI Study Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prediction.overallRecommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
