import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RubricTableData } from "./rubricTables";

interface RubricTableProps {
  data: RubricTableData;
}

export function RubricTable({ data }: RubricTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px] font-semibold">Grade</TableHead>
            <TableHead className="w-[120px] font-semibold">Score</TableHead>
            <TableHead className="font-semibold">Criteria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.grades.map((row, idx) => (
            <TableRow key={idx} className={idx === 0 ? "bg-primary/5" : ""}>
              <TableCell className="font-medium">{row.grade}</TableCell>
              <TableCell className="text-muted-foreground">{row.score}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {row.criteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
