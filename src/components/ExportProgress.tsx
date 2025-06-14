
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Share2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportProgressProps {
  studyData?: {
    totalHours: number;
    sessionsCompleted: number;
    chaptersCompleted: number;
    averageSessionLength: number;
    subjectProgress: Array<{
      name: string;
      progress: number;
      timeSpent: number;
    }>;
  };
}

const ExportProgress: React.FC<ExportProgressProps> = ({ 
  studyData = {
    totalHours: 24.5,
    sessionsCompleted: 42,
    chaptersCompleted: 8,
    averageSessionLength: 35,
    subjectProgress: [
      { name: 'Mathematics', progress: 75, timeSpent: 8.5 },
      { name: 'Physics', progress: 60, timeSpent: 6.2 },
      { name: 'Chemistry', progress: 45, timeSpent: 4.8 },
      { name: 'Biology', progress: 80, timeSpent: 5.0 }
    ]
  }
}) => {
  const { toast } = useToast();

  const generatePDFReport = () => {
    // In a real implementation, you'd use a library like jsPDF or html2pdf
    const reportContent = `
Study Progress Report
Generated on: ${new Date().toLocaleDateString()}

=== SUMMARY ===
Total Study Hours: ${studyData.totalHours} hours
Sessions Completed: ${studyData.sessionsCompleted}
Chapters Completed: ${studyData.chaptersCompleted}
Average Session Length: ${studyData.averageSessionLength} minutes

=== SUBJECT BREAKDOWN ===
${studyData.subjectProgress.map(subject => 
  `${subject.name}: ${subject.progress}% complete (${subject.timeSpent} hours)`
).join('\n')}

=== RECOMMENDATIONS ===
- Continue focusing on areas with lower completion rates
- Maintain consistent study sessions
- Consider increasing study time for subjects below 70% completion
    `;

    // Create a blob and download it
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-progress-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your study progress report has been downloaded successfully.",
    });
  };

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      studyData,
      metadata: {
        version: "1.0",
        format: "json"
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your study data has been exported as JSON.",
    });
  };

  const shareProgress = async () => {
    const shareText = `📚 My Study Progress Update!\n\n✅ ${studyData.sessionsCompleted} sessions completed\n⏰ ${studyData.totalHours} hours studied\n📖 ${studyData.chaptersCompleted} chapters finished\n\nKeep pushing towards your goals! 🎯`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Study Progress',
          text: shareText,
        });
        toast({
          title: "Shared Successfully",
          description: "Your progress has been shared!",
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to Clipboard",
          description: "Progress text copied to clipboard for sharing.",
        });
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Progress text copied to clipboard for sharing.",
      });
    }
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Study Progress Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section h3 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; }
              .stat { display: flex; justify-content: space-between; margin: 10px 0; }
              .subject { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Study Progress Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <h3>Summary Statistics</h3>
              <div class="stat"><span>Total Study Hours:</span><span>${studyData.totalHours} hours</span></div>
              <div class="stat"><span>Sessions Completed:</span><span>${studyData.sessionsCompleted}</span></div>
              <div class="stat"><span>Chapters Completed:</span><span>${studyData.chaptersCompleted}</span></div>
              <div class="stat"><span>Average Session Length:</span><span>${studyData.averageSessionLength} minutes</span></div>
            </div>
            
            <div class="section">
              <h3>Subject Progress</h3>
              ${studyData.subjectProgress.map(subject => `
                <div class="subject">
                  <strong>${subject.name}</strong><br>
                  Progress: ${subject.progress}% | Time Spent: ${subject.timeSpent} hours
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Print Dialog Opened",
      description: "Your report is ready to print.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button onClick={generatePDFReport} className="gap-2">
              <FileText className="w-4 h-4" />
              Download Report
            </Button>
            <Button onClick={exportToJSON} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button onClick={shareProgress} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Progress
            </Button>
            <Button onClick={printReport} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{studyData.totalHours}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{studyData.sessionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{studyData.chaptersCompleted}</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{studyData.averageSessionLength}</div>
              <div className="text-sm text-muted-foreground">Avg Minutes</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-4">Subject Progress</h4>
            <div className="space-y-3">
              {studyData.subjectProgress.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({subject.timeSpent}h studied)
                    </span>
                  </div>
                  <Badge variant={subject.progress >= 70 ? "default" : "secondary"}>
                    {subject.progress}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportProgress;
