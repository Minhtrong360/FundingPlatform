import React from "react";

const Table = ({
  customerResult,
  revenueResult,
  personnelResult,
  investmentResult,
  loanResult,
}) => {
  const months = [1, 2, 3, 4, 5];

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          {months?.map((month) => (
            <th className="font-" key={month}>{`Month ${month}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {customerResult?.map((item, index) => (
          <tr key={index}>
            <td>Customer {item.channelName}</td>
            {months?.map((month) => (
              <td key={month}>{item.result[month]}</td>
            ))}
          </tr>
        ))}

        {revenueResult?.map((item, index) => (
          <React.Fragment key={index}>
            <tr>
              <td>Revenue {item.revenueName}</td>
            </tr>
            {Object.keys(item).map((fieldName) => {
              if (fieldName !== "revenueName") {
                return (
                  <tr key={fieldName}>
                    <td className="pl-3">{fieldName}</td>
                    {months.map((month) => (
                      <td key={month}>{item[fieldName][month]}</td>
                    ))}
                  </tr>
                );
              }
              return null;
            })}
          </React.Fragment>
        ))}

        {personnelResult?.map((item, index) => (
          <tr key={index}>
            <td>Personnel {item.jobTitle}</td>
            {months?.map((month) => (
              <td key={month}>{item.result[month]}</td>
            ))}
          </tr>
        ))}

        {investmentResult?.map((item, index) => (
          <React.Fragment key={index}>
            <tr>
              <td>Investment {item.purchaseName}</td>
            </tr>
            {Object.keys(item).map((fieldName) => {
              if (fieldName !== "purchaseName") {
                return (
                  <tr key={fieldName}>
                    <td className="pl-3">{fieldName}</td>
                    {months.map((month) => (
                      <td key={month}>{item[fieldName][month]}</td>
                    ))}
                  </tr>
                );
              }
              return null;
            })}
          </React.Fragment>
        ))}

        {loanResult?.map((item, index) => (
          <React.Fragment key={index}>
            <tr>
              <td>Loan {item.loanName}</td>
            </tr>
            {Object.keys(item).map((fieldName) => {
              if (fieldName !== "loanName") {
                return (
                  <tr key={fieldName}>
                    <td className="pl-3">{fieldName}</td>
                    {months.map((month) => (
                      <td key={month}>{item[fieldName][month]}</td>
                    ))}
                  </tr>
                );
              }
              return null;
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
