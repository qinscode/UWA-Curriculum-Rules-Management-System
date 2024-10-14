import { Rule } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { NumberingStyle } from '../requirements/entities/style.enum'

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
  req: Requirement,
  level: number,
  levelZeroCounter: number,
  totalLevelZeroItems: number
): string => {
  console.log(
    `Rendering requirement: ${req.content}, level: ${level}, is_connector: ${req.is_connector}`
  )

  const styleClass = getStyleClass(req.style)
  const padding = level * 20
  let numberContent = ''

  if (!req.is_connector) {
    if (level === 0) {
      if (totalLevelZeroItems > 1) {
        numberContent = `<span class="rule-number">${levelZeroCounter}.</span> `
      }
    } else if (level > 0) {
      numberContent = `<span class="number"></span>`
    }
  }

  console.log(`numberContent: ${numberContent}`)

  let content = `<p class="${styleClass}${req.is_connector ? ' connector' : ''}" style="padding-left: ${padding}px;">
    ${numberContent}${req.content}
  </p>`

  if (req.children && req.children.length > 0) {
    console.log(`Rendering ${req.children.length} children for requirement: ${req.content}`)
    content += req.children
      .map((child, index) => renderRequirement(child, level + 1, index + 1, req.children.length))
      .join('')
  }

  return content
}

const renderRequirements = (requirements: Requirement[]): string => {
  console.log(`Rendering ${requirements.length} requirements`)
  let levelZeroCounter = 0
  const totalLevelZeroItems = requirements.filter((req) => !req.is_connector).length
  console.log(`Total level zero items: ${totalLevelZeroItems}`)

  return requirements
    .map((req) => {
      if (!req.is_connector) {
        levelZeroCounter++
        console.log(`Incrementing levelZeroCounter to ${levelZeroCounter}`)
      } else {
        console.log(`Skipping increment for connector: ${req.content}`)
      }
      return renderRequirement(req, 0, levelZeroCounter, totalLevelZeroItems)
    })
    .join('')
}

export const courseRulesHTMLTemplate = (
  courseName: string,
  courseCode: string,
  rules: Rule[]
): string => {
  console.log(`Generating HTML template for course: ${courseName} [${courseCode}]`)
  console.log(`Total rules: ${rules.length}`)

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseName} [${courseCode}]</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        header {
            display: flex;
            align-items: center;
            background-color: #27348b;
            color: white;
            padding: 20px;
        }
        .logo {
            max-width: 180px;
            margin-right: 20px;
        }
        h1 {
            margin-top: 20px;
            font-size: 24px;
        }
        main {
            padding: 20px;
        }
        h2 {
            color: #000;
            font-size: 18px;
        }
        p {
            font-size: 14px;
            margin: 0 0 10px 0;
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
        .rule-number {
            font-weight: bold;
            margin-right: 5px;
        }
        .rule-number::before {
            content: "";
        }
        section {
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
        body {
            counter-reset: rule;
        }
        .connector {
            list-style-type: none;
        }
        .connector::before {
            content: none;
        }
    </style>
</head>
<body>
    <header>
        <img src="https://static.weboffice.uwa.edu.au/visualid/core-rebrand/img/uwacrest/uwacrest-white.svg" alt="The University of Western Australia logo" class="logo">
        <h1>${courseName} [${courseCode}]</h1>
    </header>
    <main>
        ${rules
          .filter((rule) => rule.requirements && rule.requirements.length > 0)
          .map((rule, ruleIndex) => {
            console.log(`Rendering rule: ${rule.name}, index: ${ruleIndex}`)
            return `
        <section>
            <h2>${ruleIndex + 1}. ${rule.name}</h2>
            ${renderRequirements(rule.requirements)}
        </section>
        `
          })
          .join('')}
    </main>
</body>
</html>
  `

  console.log('HTML template generation completed')
  return htmlContent
}
