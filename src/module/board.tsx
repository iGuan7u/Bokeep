import { Box, Grid, Typography } from "@mui/material";
import { Attributes, Component, ComponentChild, ComponentChildren, Ref } from "preact";
import { Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import CostRecord from "../model/record";
import { getCostTypeDesc, getTagColor } from '../model/type';
import { deleteRecord, openIndexedDB, readAllRecords, updateRecord } from '../utils/indexd_db';

interface BoardState {
  datas: Array<CostRecord>
}

class Board extends Component<{}, BoardState> {
  constructor() {
    super();
    this.state = {
      datas: []
    };
  }
  componentDidMount = async () => {
    const db = await openIndexedDB('cost_record');
    const records = await readAllRecords(db);
    this.setState({
      datas: records
    });
    db.close();
  }


  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<BoardState>, context?: any): ComponentChild {
    // 获取今天的起始时间戳（00:00:00）
    const startOfDay = dayjs().startOf('day').valueOf();

    // 获取今天的结束时间戳（23:59:59）
    const endOfDay = dayjs().endOf('day').valueOf();

    const recordOfToday = state.datas.filter(e => e.spendTime >= startOfDay && e.spendTime <= endOfDay);

    return <Box className={"board_cnt"}>
      <Box className="board_section_cnt bg_purple">
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          本月支出
        </Typography>
      </Box>
      <Box className="board_section_cnt bg_yellow">
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          近期支出
        </Typography>
      </Box>
      <Box className="board_table_cnt">
        <Grid container spacing={{ sm: 1, md: 2 }} columns={{ xs: 1, sm: 1, md: 2 }}>
          <Grid item sm={1} xs={1}>
            <Box>
              <Box className="color_green">
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  今日支出
                </Typography>
              </Box>
              <Box className="board_table_overflow">
                <BoardTable datas={recordOfToday}></BoardTable>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={1} xs={1}>
            <Box>
              <Box className="color_orange">
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  近七天支出
                </Typography>
              </Box>
              <Box>
                <BoardTable datas={[]}></BoardTable>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>;
  }
}

interface BoardTableProps {
  datas: Array<CostRecord>;
}

interface Column {
  id: 'name' | 'price' | 'spendTime' | 'costType' | 'createTime' | 'creator';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  customRender?: (value: any) => ComponentChild
}

const columns: readonly Column[] = [
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

class BoardTable extends Component<BoardTableProps, {}> {
  render(props?: Readonly<BoardTableProps & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    if (props.datas.length == 0) {
      return <Box className="flex-cnt board_empty_desc">
        <Typography>暂无数据</Typography>
      </Box>;
    }
    var sumPrice = 0;
    props.datas.forEach((e) => {
      sumPrice += e.price;
    })
    return <Table padding='none'>
      <TableHead>
        <TableRow>
          {props.datas.length != 0 && columns.map((column) => (
            <TableCell
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
            <TableCell key="sum_tag"></TableCell>
          </TableRow>
      </TableBody>
    </Table>
  }
}

export default Board;