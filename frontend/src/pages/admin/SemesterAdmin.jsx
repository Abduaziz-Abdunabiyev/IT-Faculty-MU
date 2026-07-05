import ResourcePage from "../../components/admin/ResourcePage";

export default function SemesterAdmin() {
  const fields = [
    {
      name: "semester_n",
      label: "Semester Number",
      type: "number",
      required: true,
      placeholder: "1",
      helperText: "Semester raqamini kiriting",
    },

    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: true,
      helperText: "Semester boshlanish sanasi",
    },

    {
      name: "end_date",
      label: "End Date",
      type: "date",
      required: true,
      helperText: "Semester tugash sanasi",
    },
  ];

  const columns = [
    {
      key: "semester_n",
      label: "Semester",
      render: (row) => `Semester ${row.semester_n}`,
    },

    {
      key: "start_date",
      label: "Start Date",
    },

    {
      key: "end_date",
      label: "End Date",
    },
  ];

  return (
    <ResourcePage
      title="Semesters"
      subtitle="Manage university semesters"
      endpoint="/api/semesters/"
      resourceName="Semester"
      fields={fields}
      columns={columns}
      defaultValues={{
        semester_n: "",
        start_date: "",
        end_date: "",
      }}
    />
  );
}
