import csvParser from "csv-parser";
import { createWriteStream, WriteStream } from "fs";
import { Readable } from "stream";

/**
 * Processes a CSV buffer, aggregates total sales per department, and writes the result to a new CSV file.
 * Also returns processing time and number of departments as metrics, and writes them as comments at the top of the CSV.
 * @param inputBuffer - The uploaded CSV file as a buffer
 * @param outputPath - The path to write the aggregated CSV result
 * @returns {Promise<{ processingTimeMs: number, departmentCount: number }>}
 */
export async function processAndAggregateCsv(
  inputBuffer: Buffer,
  outputPath: string
): Promise<{ processingTimeMs: number; departmentCount: number }> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const departmentSales: Record<string, number> = {};
    const readable = Readable.from(inputBuffer);

    readable
      .pipe(csvParser())
      .on("data", (row) => {
        const department = row["Department Name"];
        const sales = parseInt(row["Number of Sales"], 10);
        if (!department || isNaN(sales)) return;
        departmentSales[department] = (departmentSales[department] || 0) + sales;
      })
      .on("end", () => {
        const processingTimeMs = Date.now() - start;
        const departmentCount = Object.keys(departmentSales).length;
        // Write aggregated results to output CSV
        const ws: WriteStream = createWriteStream(outputPath);
        ws.write("Department Name,Total Number of Sales\n");
        for (const [department, totalSales] of Object.entries(departmentSales)) {
          ws.write(`"${department}",${totalSales}\n`);
        }
        ws.end();
        ws.on("finish", () => resolve({ processingTimeMs, departmentCount }));
        ws.on("error", reject);
      })
      .on("error", reject);
  });
} 