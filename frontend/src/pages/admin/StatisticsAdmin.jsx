import ResourcePage from "../../components/admin/ResourcePage";

export default function StatisticsAdmin() {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Teachers",
      helperText: "Statistic nomini kiriting",
    },

    {
      name: "value",
      label: "Value",
      type: "number",
      required: true,
      placeholder: "120",
      helperText: "Statistic qiymatini kiriting",
    },

    {
      name: "icon",
      label: "Icon",
      type: "text",
      placeholder: "fa-users",
      helperText: "Masalan: fa-users, fa-book, fa-graduation-cap",
    },

    {
      name: "order",
      label: "Order",
      type: "number",
      required: true,
      placeholder: "1",
      helperText: "Frontenddagi tartib raqami",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Name",
    },

    {
      key: "value",
      label: "Value",
    },

    {
      key: "icon",
      label: "Icon",
      render: (row) => row.icon || "-",
    },

    {
      key: "order",
      label: "Order",
    },
  ];

  return (
    <ResourcePage
      title="Statistics"
      subtitle="Manage website statistics"
      endpoint="/api/statistics/"
      resourceName="Statistic"
      fields={fields}
      columns={columns}
      defaultValues={{
        name: "",
        value: 0,
        icon: "",
        order: 0,
      }}
    />
  );
}
