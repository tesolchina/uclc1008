import { useParams, useNavigate } from "react-router-dom";
import { UnitViewer } from "@/components/units/UnitViewer";
import { week1Hour1Units } from "@/data/units";
import { toast } from "sonner";

export default function UnitPage() {
  const { weekId, unitId } = useParams<{ weekId: string; unitId: string }>();
  const navigate = useNavigate();

  // Find the unit by ID
  const allUnits = [
    ...week1Hour1Units,
    // Add more units here as we create them
  ];

  const unit = allUnits.find(u => u.id === unitId);

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unit Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The unit "{unitId}" could not be found.
          </p>
          <button
            onClick={() => navigate(`/week/${weekId}`)}
            className="text-primary hover:underline"
          >
            Back to Week {weekId}
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/week/${weekId}`);
  };

  const handleComplete = () => {
    toast.success("Unit completed!", {
      description: `You've finished "${unit.title}"`,
    });
    
    // Find next unit
    const currentIndex = allUnits.findIndex(u => u.id === unitId);
    const nextUnit = allUnits[currentIndex + 1];
    
    if (nextUnit) {
      navigate(`/week/${weekId}/unit/${nextUnit.id}`);
    } else {
      navigate(`/week/${weekId}`);
    }
  };

  return (
    <UnitViewer
      unit={unit}
      weekId={Number(weekId)}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
}
