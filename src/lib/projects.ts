import dbConnect from "@/lib/connectDB";
import Project from "@/models/project.model";

export async function getProjects({
  page = 1,
  limit = 9,
  search = "",
  category = "All",
  sort = "latest",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "latest" | "price";
}) {
  await dbConnect();

  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (category && category !== "All") {
    query.category = category;
  }

  const sortBy = sort === "price" ? "startingPrice" : "createdAt";
  const order = sort === "price" ? 1 : -1;

  const total = await Project.countDocuments(query);

  const projects = await Project.find(query)
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  return { projects, total };
}