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
    /// dataManagement 的摘要说明
    /// </summary>
    public class dataManagement : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string hbbegintime = context.Request.Form["hbbegintime"];
            string hbendtime = context.Request.Form["hbendtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string requesttype = context.Request.Form["requesttype"];
            int dates  = int.Parse(context.Request.Form["dates"]);
            StringBuilder sqltext = new StringBuilder();
            switch (requesttype)
            {
                case "查询汇总":
                    goto cxhz;
                    break;
                default:
                    goto end;
                    break;
            }

        cxhz:;
          //  search = (search=="") ? " " : "  and DevId like '%" + search + "%'";
            if (ssdd == "all")
            {
                sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo where AlarmDay >='"+ begintime+ "' and  AlarmDay <='" + endtime + "' and AlarmType = 6 and DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo where AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType = 1 and DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*"+ dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as a WHERE AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as a WHERE AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo where AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType = 6 and DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo where AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType = 1 and DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as a WHERE AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as a WHERE AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");

            }




        end:;
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");


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