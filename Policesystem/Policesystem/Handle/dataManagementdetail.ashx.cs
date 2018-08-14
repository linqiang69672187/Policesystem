using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
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
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["starttime"];
            string endtime = context.Request.Form["endtime"];
            string entityid = context.Request.Form["entityid"];
            string ssddtext = context.Request.Form["ssddtext"];
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

            search = (search == "") ? " " : "  and DevId like '%" + search + "%'";
            if (entityid == "331000000000")
            {
                Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,AlarmType,SUM(value) val from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type + "  GROUP BY DevId,AlarmType) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
                distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type , "devcie");
            }
            else
            { 
            Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='"+ entityid + "' OR BMDM = '"+ entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select data.Devid,data.AlarmType,data.val,us.JYBH,us.XM,us.SJ from (SELECT DevId,AlarmType,SUM(value) val from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type + "  GROUP BY DevId,AlarmType) as data left join Device de on de.DevId = data.DevId left join ACL_USER us on us.JYBH = de.JYBH   order by data.DevId", "Alarm_EveryDayInfo");
            distinctdevic = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + entityid + "' OR BMDM ='" + entityid + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) select DISTINCT Devid from Alarm_EveryDayInfo where Entity in(SELECT BMDM FROM childtable) AND AlarmType<>6 AND AlarmDay >='" + begintime + "' and AlarmDay <='" + endtime + "' and DevType = " + type , "Alarm_EveryDayInfo");
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
            string reTitle = "";// ExportExcel(dtreturns, type, begintime, endtime, title, ssdd, sszd, context.Request.Form["ssddtext"], context.Request.Form["sszdtext"]);
            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, reTitle));
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