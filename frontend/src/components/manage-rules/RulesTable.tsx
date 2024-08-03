import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react'

interface Rule {
  id: number
  code: string
  name: string
  type: string
}

interface RulesTableProps {
  rules: Rule[]
  onDelete: (id: number) => void
}

export function RulesTable({ rules, onDelete }: RulesTableProps) {
  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader>
        <TableColumn>COURSE CODE</TableColumn>
        <TableColumn>COURSE NAME</TableColumn>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>{rule.code}</TableCell>
            <TableCell>{rule.name}</TableCell>
            <TableCell>{rule.type}</TableCell>
            <TableCell>
              <Button size="sm" color="primary" className="mr-2">
                Edit
              </Button>
              <Button size="sm" color="danger" onPress={() => onDelete(rule.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
