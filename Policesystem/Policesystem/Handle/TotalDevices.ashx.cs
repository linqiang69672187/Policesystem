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
            //  string BMDM = context.Request.Cookies["BMDM"].Value;

            //HttpCookie cookie = new HttpCookie("cookieName");
            //cookie.Value = "331001000000";
            //HttpContext.Current.Response.Cookies.Add(cookie);
          

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
            string BMDM = "331000000000";
          
            DataTable dt;
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }
            switch (BMDM)
            {
                case "331000000000":
                    sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM in ('331001000000','331002000000','331003000000','331004000000') OR BMDM  in ('331001000000','331002000000','331003000000','331004000000') UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM )  SELECT count(ID) as value,0 as value2 FROM [Device] union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 union all SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM in (SELECT BMDM FROM childtable) union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM in (SELECT BMDM FROM childtable) union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM in (SELECT BMDM FROM childtable))");
      
                    dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":


                    sqltext.Append(" WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM in (SELECT BMDM FROM childtable) union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM in (SELECT BMDM FROM childtable) union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM in (SELECT BMDM FROM childtable))");
                    DataTable dt2 = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB"); ;
                    sqltext.Clear();

                    sqltext.Append(" WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM in (SELECT BMDM FROM childtable) union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM in (SELECT BMDM FROM childtable) union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM in (SELECT BMDM FROM childtable))");
                     dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB"); ;
                    foreach (DataRow dr in dt2.Rows)
                    {
                        dt.ImportRow(dr);
                    }


                    break;
                default:
                    DataTable dtentity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT [SJBM] FROM [Entity] where BMDM = '"+ BMDM + "'", "DB");
                    string tempdw = "";
                    for (int i1 = 0; i1 < dtentity.Rows.Count; i1++)
                    {
                        tempdw = dtentity.Rows[i1]["SJBM"].ToString();
                    }
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + tempdw + "' OR BMDM ='" + tempdw + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM in (SELECT BMDM FROM childtable) union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM in (SELECT BMDM FROM childtable) union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM in (SELECT BMDM FROM childtable)) UNION ALL  SELECT count(ID) as value,0 as value2 FROM [Device] where BMDM ='" + BMDM + "' union all SELECT  sum(HandleCnt) as value,SUM([OnlineTime]) as value2  FROM StatsInfo_Yestorday_Today where Time > GETDATE()-1 and BMDM ='"+BMDM+ "' union all SELECT  count(id) as value1,0 as value2 FROM [Gps] where IsOnline=1 and PDAID in (SELECT [DevId] FROM [Device] where BMDM = '"+BMDM+"')");

                    dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

                    break;
            }

           

            context.Response.Write(JSON.DatatableToDatatableJS(dt, BMDM));
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