import { Rule } from 'src/types'

export const courseRulesTemplate = (rules_list: Rule[]) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mongolian&display=swap" rel="stylesheet">
    <title>Course Rules</title>
    <style>
        body {
            font-family: Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.3;
            margin: 20px;
            padding: 10px;
            border: none;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            vertical-align: top;
        }

        th {
            background-color: #edf0fc;
            color: #0864a5;
            font-weight: bold;
            text-align: left;
            border: 1px solid #a2b4fa;
            padding: 3px;
            margin-left: 5px;
        }

        .section-title {
            font-weight: bold;
            width: 17%;
        }

        .section-content {
            width: 78%;
        }
        
        .section-content p {
            margin-top: 0;
        }

        table tr:nth-child(2) td {
            padding-top: 10px;
        }
        
        .number {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <th colspan="2">Rules</th>
        </tr>
        ${rules_list
          .map(
            (rule) => `
        <tr>
            <td class="section-title">${rule.title}</td>
            <td class="section-content">
                ${rule.content
                  .map(
                    (part) => `
                    <p><span class="number">${part.number}</span> ${part.text}</p>
                `
                  )
                  .join('')}
            </td>
        </tr>
        `
          )
          .join('')}
    </table>
</body>

</html>
`
