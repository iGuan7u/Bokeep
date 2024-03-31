import { Box, Typography } from "@mui/material";
import { Component, ComponentChild, ComponentChildren, Ref } from "preact";

import { Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CostRecord from "../../model/record";
import TableColumn from "../../utils/table_column";
import { getCostTypeDesc, getTagColor } from '../../model/type';

interface BriefTableProps {
  datas: Array<CostRecord>;
}

const columns: readonly TableColumn[] = [
  {
    id: 'name',
    label: '项目',
    minWidth: 140,
    customRender: function (value) {
      return <div className="table_name">{value}</div>
    }
  },
  {
    id: 'price',
    label: '金额',
    minWidth: 140,
    align: 'right',
    format: function (value: number) {
      return `CN¥ ${value.toFixed(2)}`
    },
  },
  {
    id: 'costType',
    label: '类别',
    minWidth: 100,
    align: 'right',
    customRender: function (value) {
      const classString = `cost-type-tag cost-type-tag_${getTagColor(value)}`
      return <div className="flex-cnt flex-cnt-jce">
        <div className={classString}>
          <span>{getCostTypeDesc(value)}</span>
        </div>
      </div>
    }
  },
];

class BriefTable extends Component<BriefTableProps, {}> {
  render(props?: Readonly<BriefTableProps & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    if (props.datas.length == 0) {
      return <Box className="flex-cnt board_empty_desc">
        <Typography>暂无数据</Typography>
      </Box>;
    }
    let sumPrice = 0;
    props.datas.forEach((e) => {
      sumPrice += e.price;
    });
    return <Table padding='none'>
      <TableHead>
        <TableRow>
          {props.datas.length != 0 && columns.map((column) => (
            <TableCell
              className='table_th'
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth, padding: '6px' }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.datas
          .map((row) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
                // onClick={(event: MouseEvent) => this.handleClick(event, row.id)}
                sx={{ cursor: 'pointer' }}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align} sx={{ padding: '6px' }}>
                      {(column.customRender ? column.customRender(value) : (typeof value == 'number' && column.format ? column.format(value) : value))}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        <TableRow>
          <TableCell key="sum_name" className="no_boarder" align="right">
            <span className="table_sum_prefix">COUNT: </span> {props.datas.length}</TableCell>
          <TableCell key="sum_price" className="no_boarder" align="right" >
            <span className="table_sum_prefix">SUM: CN¥</span> {sumPrice.toFixed(2)} </TableCell>
          <TableCell key="sum_tag" className="no_boarder"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  }
}

export default BriefTable;