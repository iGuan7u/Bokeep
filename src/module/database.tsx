import { Attributes, Component, ComponentChild, ComponentChildren, Ref } from "preact";

import { Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import dayjs from 'dayjs';

import CostRecord from '../model/record';
import { getCostTypeDesc, getTagColor } from '../model/type';
import CreateDialog from './create_dialog';
import { deleteRecord, openIndexedDB, readAllRecords, updateRecord } from '../utils/indexd_db';


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
    minWidth: 130,
    align: 'right',
    format: function (value: number) {
      return `CN¥ ${value.toFixed(2)}`
    },
  },
  {
    id: 'spendTime',
    label: '时间',
    minWidth: 85,
    align: 'right',
    format: function (value: number) {
      return dayjs(value).format('YYYY-MM-DD')
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
  {
    id: 'createTime',
    label: '创建时间',
    minWidth: 85,
    align: 'right',
    format: function (value: number) {
      return dayjs(value).format('YYYY-MM-DD')
    },
  },
  {
    id: 'creator',
    label: '创建人',
    minWidth: 80,
    align: 'right',
  },
];

interface DatabaseState {
  datas: Array<CostRecord>;
  isModalOpen: boolean;
  modifyRecord?: CostRecord;
}

class Database extends Component<{}, DatabaseState> {

  constructor() {
    super();
    this.state = {
      datas: new Array<CostRecord>(),
      isModalOpen: false,
      modifyRecord: null,
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

  handleUpdate = async (record: CostRecord) => {
    const index = this.state.datas.findIndex(value => value.id == record.id);
    const db = await openIndexedDB('cost_record');
    if (index >= 0) {
      this.setState(prevState => ({
        datas: prevState.datas.map((item, i) => (i === index ? record : item))
      }));
      await updateRecord(record, db);
    }
    db.close();
  }

  handleClick = (event: MouseEvent, id: string) => {
    event.preventDefault();
    const record = this.state.datas.find((value) => value.id == id);
    this.setState({
      modifyRecord: record,
      isModalOpen: true,
    });
  }

  handleClose = () => {
    this.setState({
      isModalOpen: false,
      modifyRecord: null,
    });
  }

  handleOnDelete = async (record: CostRecord) => {
    const db = await openIndexedDB('cost_record');
    await deleteRecord(record, db);
    this.setState({
      datas: this.state.datas.filter(value => value.id != record.id),
    });
    db.close();
  }


  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<DatabaseState>, context?: any): ComponentChild {
    var sumPrice = 0;
    state.datas.forEach((e) => {
      sumPrice += e.price;
    })
    return <>
      <Table padding='none'>
        <TableHead>
          <TableRow>
            {this.state.datas.length != 0 && columns.map((column) => (
              <TableCell
                className='table-header-th'
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
          {this.state.datas
            .map((row) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  onClick={(event: MouseEvent) => this.handleClick(event, row.id)}
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
              <span className="table_sum_prefix">COUNT: </span> {state.datas.length}</TableCell>
            <TableCell key="sum_price" className="no_boarder" align="right" >
              <span className="table_sum_prefix">SUM: CN¥</span> {sumPrice.toFixed(2)} </TableCell>
            <TableCell key="sum_tag"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <CreateDialog
        open={this.state.isModalOpen}
        modifyRecord={this.state.modifyRecord}
        onFinished={this.handleUpdate}
        onDeleted={this.handleOnDelete}
        onClose={this.handleClose}
      />
    </>;
  }
}

export default Database;