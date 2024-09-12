import { Rule } from 'src/types'
import { NumberingStyle } from '../requirements/entities/style.enum'

const verticalGap = '15px'
const horizontalGap = '20px'

const sectionTitleMaxWidth = '150px'
const sectionContentPaddingLeft = '20px'

const getStyleClass = (style: NumberingStyle): string => {
  switch (style) {
    case NumberingStyle.Alphabetic:
      return 'alphabetic'
    case NumberingStyle.Roman:
      return 'roman'
    case NumberingStyle.None:
      return 'none'
    default:
      return 'numeric'
  }
}

const renderRequirement = (
  req: any,
  level: number,
  isFirstChild: boolean,
  ruleIndex: number,
  levelZeroCounter: number,
  totalLevelZeroItems: number
): string => {
  const styleClass = getStyleClass(req.style)
  const padding = level * 20
  let numberContent = ''

  if (level === 0) {
    if (totalLevelZeroItems > 1) {
      numberContent = `<span class="rule-number">(${levelZeroCounter})</span> `
    }
  } else if (level > 0) {
    numberContent = `<span class="number"></span>`
  }

  return `
    <p class="${styleClass}" style="padding-left: ${padding}px;">
      ${numberContent}${req.text}
    </p>
    ${req.children ? req.children.map((child, index) => renderRequirement(child, level + 1, index === 0, ruleIndex, levelZeroCounter, totalLevelZeroItems)).join('') : ''}
  `
}

export const courseRulesTemplate = (rules_list: Rule[]) => {
  return `
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
            border: none;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 ${horizontalGap}; 
                margin-top: -${horizontalGap}; /* 抵消第一行上方的间距 */

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
            max-width: ${sectionTitleMaxWidth};
            word-wrap: break-word;
            white-space: normal;
        }

        .section-content {
            width: 97%;
            padding-left: ${sectionContentPaddingLeft};
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }
        
        .section-content p {
            margin-top: 0;
            margin-bottom: ${verticalGap};  
        }

        table tr:nth-child(2) td {
            padding-top: 10px;
        }
        
        .number {
            font-weight: bold;
        }
        
        .numeric > .number::before {
            content: "(" counter(numeric) ") ";
            counter-increment: numeric;
        }
        
        .alphabetic > .number::before {
            content: "(" counter(alphabetic, lower-alpha) ") ";
            counter-increment: alphabetic;
        }
        
        .roman > .number::before {
            content: "(" counter(roman, lower-roman) ") ";
            counter-increment: roman;
        }
        
        .none > .number::before {
            content: "";
        }
        
        .section-content {
            counter-reset: numeric alphabetic roman;
        }

        .numeric {
            counter-reset: alphabetic;
        }

        .alphabetic {
            counter-reset: roman;
        }

        .roman {
            counter-reset: numeric;
        }
        
        .rule-number {
            font-weight: bold;
            margin-right: 1px;
        }
        
        .rule-number::before {
            content: "";
        }
        
        body {
            counter-reset: rule;
        }
        
        .rule-order {
            font-weight: bold;
            font-size: 12px;
            margin: 0;
            padding-right: 5px;
        }
        
        .rule-content {
            flex: 1;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <th colspan="2">Rules</th>
        </tr>
        ${rules_list
          .map((rule, ruleIndex) => {
            let levelZeroCounter = 0
            const totalLevelZeroItems = rule.content.length
            const ruleOrder = ruleIndex + 1
            return `
        <tr>
            <td class="section-title">${rule.title}</td>
            <td class="section-content">
                <span class="rule-order">${ruleOrder}.</span>
                <div class="rule-content">
                ${rule.content
                  .map((req, index) => {
                    levelZeroCounter++
                    return renderRequirement(
                      req,
                      0,
                      index === 0,
                      ruleIndex + 1,
                      levelZeroCounter,
                      totalLevelZeroItems
                    )
                  })
                  .join('')}
                </div>
            </td>
        </tr>
        `
          })
          .join('')}
    </table>
</body>

</html>
`
}
