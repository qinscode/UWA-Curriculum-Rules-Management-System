import { Rule } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'

const renderRequirements = (requirements: Requirement[], parentIndex: string = ''): string => {
  return requirements
    .map((req, index) => {
      const currentIndex = parentIndex ? `${parentIndex}(${index + 1})` : `${index + 1}.`
      let content = `<p${req.is_connector ? '' : ` class="indent"`}>${req.is_connector ? '' : currentIndex} ${req.content}</p>`

      if (req.children && req.children.length > 0) {
        content += renderRequirements(req.children, currentIndex)
      }

      return content
    })
    .join('')
}

export const courseRulesHTMLTemplate = (
  courseName: string,
  courseCode: string,
  rules: Rule[]
): string => {
  return `
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
        p, li {
            font-size: 14px;
        }
        .indent {
            margin-left: 20px;
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
          .map(
            (rule) => `
        <section>
            <h2>${rule.name}</h2>
            ${renderRequirements(rule.requirements)}
        </section>
        `
          )
          .join('')}
    </main>
</body>
</html>
  `
}
