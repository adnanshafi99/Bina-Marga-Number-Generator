import { BASTHistory } from "@/components/bast/BASTHistory";
import { History } from "lucide-react";

export default function BASTHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">BAST Records History</h1>
          <p className="text-lg text-muted-foreground">
            View and filter all generated BAST numbers
          </p>
        </div>
        <BASTHistory />
      </div>
    </div>
  );
}


