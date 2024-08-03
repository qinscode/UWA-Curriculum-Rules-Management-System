import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react'

type Rule = {
  code: string
  name: string
  type: string
}

type RulesTableProps = {
  rules: Rule[]
}

export function RulesTable({ rules }: RulesTableProps) {
  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader>
        <TableColumn>COURSE CODE</TableColumn>
        <TableColumn>COURSE NAME</TableColumn>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {rules.map((rule, index) => (
          <TableRow key={index}>
            <TableCell>{rule.code}</TableCell>
            <TableCell>{rule.name}</TableCell>
            <TableCell>{rule.type}</TableCell>
            <TableCell>
              <Button size="sm" color="primary" className="mr-2">
                Edit
              </Button>
              <Button size="sm" color="danger">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
