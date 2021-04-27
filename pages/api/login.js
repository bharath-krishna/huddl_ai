export default async (req, res) => {
  res.statusCode = 200;
  res.json([{ Name: "SomeData" }, { Name: "SomeOtherData" }]);
};
