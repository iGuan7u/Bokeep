import { Box, Typography } from "@mui/material";
import { Component, ComponentChild, RenderableProps } from "preact";

import { Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { CostType } from '../../model/type';
import TableColumn from "../../utils/table_column";
import { getCostTypeDesc, getTagColor } from '../../model/type';
import CostRecord from "../../model/record";

interface Summary {
  costType: CostType;
  totalPrice: number;
  totalCount: number;
  budget: number;
}

const columns: readonly TableColumn[] = [
  {
    id: 'costType',
    label: '类别',
    minWidth: 100,
    align: 'center',
    customRender: function (value) {
      const classString = `cost-type-tag cost-type-tag_${getTagColor(value)}`
      return <div className="flex-cnt flex-cnt-jcc">
        <div className={classString}>
          <span>{getCostTypeDesc(value)}</span>
        </div>
      </div>
    }
  },
  {
    id: 'totalPrice',
    label: '总额',
    minWidth: 140,
    align: 'right',
    format: function (value: number) {
      return `CN¥ ${value.toFixed(2)}`
    },
  },
  {
    id: 'totalCount',
    label: '总数',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'budget',
    label: '预算',
    minWidth: 100,
    align: 'right',
  },
];

interface SummaryTableProps {
  records: Array<CostRecord>;
}

interface SummaryTableState {
  datas: Array<Summary>;
}

class SummaryTable extends Component<SummaryTableProps, SummaryTableState> {
  constructor() {
    super();
    this.state = {
      datas: [],
    };
  }

  componentDidMount(): void {
    // this.updateData();
  }

  componentWillReceiveProps(nextProps: Readonly<SummaryTableProps>, nextContext: any): void {
    this.updateData(nextProps.records);
  }

  // componentDidUpdate(previousProps: Readonly<SummaryTableProps>, previousState: Readonly<SummaryTableState>, snapshot: any): void {
  //   this.updateData();
  // }

  private updateData(records: Array<CostRecord>) {
    let costTypeMap = new Map<CostType, Summary>();
    for (const record of records) {
      let summary: Summary;
      if (!costTypeMap.has(record.costType)) {
        summary = {
          costType: record.costType,
          totalPrice: 0,
          totalCount: 0,
          budget: 0
        };
        costTypeMap.set(summary.costType, summary);
      } else {
        summary = costTypeMap.get(record.costType);
      }
      summary.totalCount += 1;
      summary.totalPrice += record.price;
    }
    const datas = Array.from(costTypeMap.values());
    debugger;
    this.setState({
      datas: datas.sort((a, b) => a.costType - b.costType)
    });
  
  }

  render(props?: RenderableProps<SummaryTableProps, any>, state?: Readonly<SummaryTableState>, context?: any): ComponentChild {
    if (state.datas.length == 0) {
      return <Box className="flex-cnt board_empty_desc">
        <Typography>暂无数据</Typography>
      </Box>;
    }
    return <Table padding='none'>
      <TableHead>
        <TableRow>
          {state.datas.length != 0 && columns.map((column) => (
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
        {state.datas
          .map((row) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell 
                      key={column.id} 
                      align={column.align} 
                      sx={{ padding: '6px' }}>
                      {(column.customRender ? column.customRender(value) : (typeof value == 'number' && column.format ? column.format(value) : value))}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  }
}

export default SummaryTable;