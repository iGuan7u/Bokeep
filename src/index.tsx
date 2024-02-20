import { render, ComponentChild, Component, Attributes, ComponentChildren, Ref } from 'preact';

import './style.css';
import { getCostTypeDesc, getTagColor } from './model/type';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateDialog from './create_dialog';
import CostRecord from './model/record';
import { addRecord, deleteRecord, openIndexedDB, readAllRecords, updateRecord } from './utils/indexd_db';
import dayjs from 'dayjs';
import { Theme, ThemeProvider, createTheme, Table } from '@mui/material';


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
    minWidth: 100,
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

interface AppState {
  datas: Array<CostRecord>;
  isModalOpen: boolean;
  modifyRecord?: CostRecord;
  theme: Theme;
}

class App extends Component<{}, AppState> {
  constructor() {
    super();
    this.state = {
      datas: new Array<CostRecord>(),
      isModalOpen: false,
      theme: createTheme({
        typography: {
          fontFamily: [
            "ui-sans-serif",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Helvetica",
            "Apple Color Emoji",
            "Arial",
            "sans-serif",
            "Segoe UI Emoji",
            "Segoe UI Symbol"
          ].join(','),
        },
      }),
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

  handleClose = () => {
    this.setState({
      isModalOpen: false,
      modifyRecord: null,
    });
  }

  handleClickOpen = () => {
    this.setState({
      isModalOpen: true,
      modifyRecord: null,
    });
  }

  handleCreate = async (record: CostRecord) => {
    const index = this.state.datas.findIndex(value => value.id == record.id);
    const db = await openIndexedDB('cost_record');
    if (index >= 0) {
      this.setState(prevState => ({
        datas: prevState.datas.map((item, i) => (i === index ? record : item))
      }));
      await updateRecord(record, db);
    } else {
      await addRecord(record, db);
      this.setState({
        datas: this.state.datas.concat([record])
      });
    }
    db.close();
  }

  handleOnDelete = async (record: CostRecord) => {
    const db = await openIndexedDB('cost_record');
    await deleteRecord(record, db);
    this.setState({
      datas: this.state.datas.filter(value => value.id != record.id),
    });
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

  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    return <ThemeProvider theme={this.state.theme}>
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
        </TableBody>
      </Table>
      <CreateDialog
        modifyRecord={this.state.modifyRecord}
        open={this.state.isModalOpen}
        onFinished={this.handleCreate}
        onDeleted={this.handleOnDelete}
        onClose={this.handleClose}
      >
      </CreateDialog>
      <div className={"float_button"}>
        <IconButton size='large' onClick={this.handleClickOpen}>
          <AddCircleOutlineIcon color='primary' sx={{ fontSize: 28 }} />
        </IconButton>
      </div>
    </ThemeProvider>;
  }
}

render(<App />, document.getElementById('app'));
