import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";

const CustomTable = () => {
  return (
    <Table className="p-5 border rounded">
      <TableCaption>A list of fractional owners</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">S/N</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Fraction</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">01</TableCell>
          <TableCell>secret...5786</TableCell>
          <TableCell>3.0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">02</TableCell>
          <TableCell>secret...2728</TableCell>
          <TableCell>3.0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">03</TableCell>
          <TableCell>secret...5738</TableCell>
          <TableCell>5.0</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CustomTable;
