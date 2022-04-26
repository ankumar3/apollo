const ModelTable = ({ models }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Make ID</th>
          <th>Make Name</th>
          <th>Model ID</th>
          <th>Model Name</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model, i) => (
          <tr key={i}>
            <td>{model.Make_ID}</td>
            <td>{model.Make_Name}</td>
            <td>{model.Model_ID}</td>
            <td>{model.Model_Name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ModelTable;
