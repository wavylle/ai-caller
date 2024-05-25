import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";
// import prisma db
import db from "../db.server";
export async function loader() {
  return json({
    message: "success"
  });
}

export async function action({ request }) {
  const method = request.method;
  switch (method) {
    case "POST":
      try {
        // Read the request body
        const bodyText = await request.text();
        const requestBody = JSON.parse(bodyText);
        const { csvData, groupId, fileName } = requestBody;

        // Define the directory and file path
        const directoryPath = path.join(process.cwd(), "uploads");
        const fileNameFinal = `${fileName.replace(/\.[^.]+$/, '')}_${Date.now()}.csv`;
        const filePath = path.join(directoryPath, fileNameFinal);

        // Ensure the directory exists
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath);
        }

        // Write the CSV data to the file
        fs.writeFileSync(filePath, csvData);

        console.log("CSV Data saved to:", filePath);

        // Create a record in the uploadedfiles table using db.uploadedfiles.create()
        const uploadedFile = await db.uploadedfiles.create({
          data: {
            groupId: parseInt(groupId),
            fileName: fileNameFinal
          }
        });

        console.log("Uploaded file record created:", uploadedFile);

        // Return success response
        return json({ message: "CSV data saved successfully", method: "POST" });
      } catch (error) {
        console.error("Error saving CSV data:", error);
        return new Response("Internal Server Error", { status: 500 });
      }

    case "PATCH":
      // Implement PATCH method logic if needed
      return json({ message: "Success", method: "PATCH" });

    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
