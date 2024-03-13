import { Box, Grid, Typography } from "@mui/material";
import { Attributes, Component, ComponentChild, ComponentChildren, Ref } from "preact";

import dayjs from 'dayjs';

import CostRecord from "../../model/record";
import BriefTable from "./brief_table";
import { deleteRecord, openIndexedDB, updateRecord, indexedDBEventEmitter, readSpendTimeRangeRecords } from '../../utils/indexd_db';
import SummaryTable from "./summary_table";

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
  componentDidMount = () => {
    this.updateData();
    indexedDBEventEmitter.on(this.updateData);
  }

  componentWillUnmount(): void {
    indexedDBEventEmitter.off(this.updateData);
  }

  private updateData = async () => {
    const currentTime = dayjs();
    // 计算七天前的时间
    const mouthAgo = currentTime.subtract(31, 'day').valueOf();
    const endOfTodayTimestamp = currentTime.endOf('day').valueOf();
    const db = await openIndexedDB('cost_record');
    const records = await readSpendTimeRangeRecords(db, mouthAgo, endOfTodayTimestamp);
    this.setState({
      datas: records
    });
    db.close();
  }


  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<BoardState>, context?: any): ComponentChild {
    // 获取今天的起始时间戳（00:00:00）
    const currentTime = dayjs();
    const startOfDay = currentTime.startOf('day').valueOf();
    // 获取今天的结束时间戳（23:59:59）
    const endOfDay = currentTime.endOf('day').valueOf();
    // 计算七天前的时间
    const sevenDaysAgo = currentTime.subtract(7, 'day').valueOf();

    const recordOfToday = state.datas.filter(e => e.spendTime >= startOfDay && e.spendTime <= endOfDay);
    const recordOfWeek = state.datas.filter(e => e.spendTime >= sevenDaysAgo && e.spendTime <= endOfDay);

    return <Box>
      <Box className="board_section_cnt bg_purple">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          本月支出
        </Typography>
      </Box>
      <Box className="board_table_overflow">
        <SummaryTable records={state.datas}></SummaryTable>
      </Box>
      <Box className="board_section_cnt bg_yellow">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          近期支出
        </Typography>
      </Box>
      <Box className="board_table_cnt">
        <Grid container spacing={{ sm: 1, md: 2 }} columns={{ xs: 1, sm: 1, md: 2 }}>
          <Grid item sm={1} xs={1}>
            <Box>
              <Box className="board_table_title color_green">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  今日支出
                </Typography>
              </Box>
              <Box className="board_table_overflow">
                <BriefTable datas={recordOfToday}></BriefTable>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={1} xs={1}>
            <Box>
              <Box className="board_table_title color_orange">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  近七天支出
                </Typography>
              </Box>
              <Box className="board_table_overflow">
                <BriefTable datas={recordOfWeek}></BriefTable>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>;
  }
}


export default Board;