using DbComponent;
using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// dataManagementdetail 的摘要说明
    /// </summary>
    public class dataManagementdetail : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Cookies["search"].Value;
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["starttime"];
            string endtime = context.Request.Form["endtime"];
            string entityid = context.Request.Form["entityid"];
            string ssddtext = context.Request.Form["ssddtext"];
            string sreachcondi = "";
            StringBuilder sqltext = new StringBuilder();
            DataTable Alarm_EveryDayInfo = null; //每日告警
            DataTable distinctdevic = null; //设备
            DataTable dtreturns = new DataTable(); //返回数据表
            dtreturns.Columns.Add("cloum1");
            dtreturns.Columns.Add("cloum2");
            dtreturns.Columns.Add("cloum3");
            dtreturns.Columns.Add("cloum4");
            dtreturns.Columns.Add("cloum5");
            dtreturns.Columns.Add("cloum6");

         switch (search)
            {
                case "":
                    break;
                default:
                    sreachcondi = "and [DevId] like '%" + search + "%'  ";
                    break;
            }

            if (entityid == "331000000000")
            {
                switch (type)
                {
                    case "5":
                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,1 as AlarmType,SUM(value) val from EveryDayInfo_ZFJLY where Entity in(SELECT BMDM FROM childtable) " + sreachcondi + "  AND [Time]  >='" + begintime + "' and [Time] <='" + endtime + "'   GROUP BY DevId) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
                        distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from EveryDayInfo_ZFJLY where Entity in(SELECT BMDM FROM childtable) AND [Time] >='" + begintime + "' and [Time] <='" + endtime + "' " + sreachcondi + " and DevType = " + type, "devcie");
                        break;
                    default:
                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,AlarmType,SUM(value) val from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' " + sreachcondi + " and DevType = " + type + "  GROUP BY DevId,AlarmType) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
                        distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' " + sreachcondi + " and DevType = " + type, "devcie");
                        break;
                }
            }
            else
            {
                switch (type)
                {
                    case "5":
                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + entityid + "' OR BMDM = '" + entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,1 as AlarmType,SUM(value) val from EveryDayInfo_ZFJLY where Entity in(SELECT BMDM FROM childtable) " + sreachcondi + " AND [Time] >='" + begintime + "' and [Time] <='" + endtime + "'  GROUP BY DevId) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
                        distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + entityid + "' OR BMDM ='" + entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from EveryDayInfo_ZFJLY where Entity in(SELECT BMDM FROM childtable) " + sreachcondi + " AND [Time] >='" + begintime + "' and [Time] <='" + endtime + "' and DevType = " + type, "Alarm_EveryDayInfo");
                        break;
                    default:

                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + entityid + "' OR BMDM = '" + entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,AlarmType,SUM(value) val from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) " + sreachcondi + " AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type + "  GROUP BY DevId,AlarmType) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
                        distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + entityid + "' OR BMDM ='" + entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) " + sreachcondi + " AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type, "Alarm_EveryDayInfo");
                        break;
                }
            }

            for (int i1 = 0; i1 < distinctdevic.Rows.Count; i1++) {
              

                DataRow dr = dtreturns.NewRow();
                dr["cloum1"] = (i1 + 1).ToString(); ;
                dr["cloum2"] = distinctdevic.Rows[i1]["DevId"].ToString();
                var rows = from p in Alarm_EveryDayInfo.AsEnumerable() where (p.Field<string>("DevId") == distinctdevic.Rows[i1]["DevId"].ToString()) select p;
                        foreach (var item in rows)
                        {
                          if (item["val"] is DBNull) { }
                            else
                            {
                             switch (item["AlarmType"].ToString())
                             {
                            case "1":
                                dr["cloum6"] = Math.Round((double)Convert.ToInt32(item["val"]) / 3600, 2); ; ;
                                break;
                            case "2":
                                break;
                            case "3":
                                break;
                            case "4":
                                break;
                            case "5":
                                break;
                            }



                        }
                    dr["cloum3"] = item["XM"];
                    dr["cloum4"] = item["JYBH"];
                    dr["cloum5"] = item["SJ"];
                }
                dtreturns.Rows.Add(dr);

            }




        end:;
            string reTitle = ExportExcel(dtreturns, type, begintime, endtime, context.Request.Form["ssddtext"]);
            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, reTitle));
        }
        public string ExportExcel(DataTable dt, string type, string begintime, string endtime, string ssddtext)
        {
            ExcelFile excelFile = new ExcelFile();
            var tmpath = "";
            string Entityname = "";
            Entityname += (ssddtext == "全部") ? "台州交警局" : ssddtext;
            tmpath = HttpContext.Current.Server.MapPath("templet\\mingxi\\1.xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];


            DateTime bg = Convert.ToDateTime(begintime);
            DateTime ed = Convert.ToDateTime(endtime);
            string typename = "";
            switch (type)
            {
                case "1":
                    typename = "车载视频";
                    break;
                case "2":
                    typename = "对讲机";
                    break;
                case "3":
                    typename = "拦截仪";
                    break;
                case "5":
                    typename = "执法记录仪";
                    break;
                case "4":
                    typename = "警务通";
                    break;
                case "6":
                    typename = "辅警通";
                    break;
            }

            sheet.Rows[0].Cells["A"].Value = begintime.Replace("/", "-") + "_" + endtime.Replace("/", "-") + Entityname + typename + "设备详情报表";

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["D"].Value = dt.Rows[i][3].ToString();
                sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][4].ToString();
                sheet.Rows[i + 2].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                sheet.Rows[i + 2].Cells["F"].Value = dt.Rows[i][5].ToString();
            }

            tmpath = HttpContext.Current.Server.MapPath("upload\\" + sheet.Rows[0].Cells[0].Value + ".xls");

            excelFile.SaveXls(tmpath);
            return sheet.Rows[0].Cells[0].Value + ".xls";
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}