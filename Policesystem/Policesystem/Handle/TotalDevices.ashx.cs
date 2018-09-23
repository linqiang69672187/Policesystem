using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using DbComponent;

namespace Policesystem.Handle
{
    /// <summary>
    /// 获取总设备数、总执法量、总在线数、总在线时长
    /// </summary>
    public class TotalDevices : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
          //  context.Response.Cookies["BMDM"].Value = "331001000000";
            string BMDM = context.Request.Cookies["BMDM"].Value;
            switch (BMDM)
            {
                case "331000000000":
                    sqltext.Append("SELECT count(ID) as value,0 as value2 FROM [Device] union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM in (SELECT BMDM FROM childtable) union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM in (SELECT BMDM FROM childtable) union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM in (SELECT BMDM FROM childtable))");
                    break;
                default:
                    sqltext.Append("SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM ='"+ BMDM + "' union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM ='"+BMDM+ "' union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM = '"+BMDM+"')");
                    break;
            }

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, ""));
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