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
    /// 首页大屏大队轮播页面;
    /// </summary>
    public class Jqueryflipster : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            StringBuilder json = new StringBuilder();
            string dwmc = "";
            string sbSQL = "";

            //HttpCookie cookie = new HttpCookie("cookieName");
            //cookie.Value = "331001000000";
            //HttpContext.Current.Response.Cookies.Add(cookie);

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
            string BMDM = "331000000000";
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }
            switch (BMDM)
            {
                case "331000000000":
                    sbSQL = "SELECT BMMC,BMDM from [Entity] where [SJBM] = '331000000000' and BMMC like '台州市交通警察支队直属%' order by Sort"; //目前只需要查询四个大队
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sbSQL = "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT BMMC,BMDM from [Entity] where BMDM in (SELECT BMDM FROM childtable) order BY CASE WHEN Sort IS NULL THEN 1 ELSE Sort END desc";
                    break;
                default:
                    sbSQL = "SELECT BMMC,BMDM from [Entity] where [BMDM] = '"+BMDM+"' "; //目前只需要查询四个大队
                    break;
            }

            DataTable dtfrist = SQLHelper.ExecuteRead(CommandType.Text, sbSQL, "1");
            json.Append("[");
            for (int i1 = 0; i1 < dtfrist.Rows.Count; i1++)
            {
                dwmc = dtfrist.Rows[i1]["BMMC"].ToString();
                if (i1 > 0)
                {
                    json.Append(',');
                };
                json.Append("{\"Name\":");
                json.Append('"');
                json.Append(dwmc.Substring(11));
                json.Append('"');
                json.Append(',');
                sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '"+ dtfrist.Rows[i1]["BMDM"].ToString() + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT count(a.id) count, c.TypeName, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) Isused,sum([IsOnline]) online from Device a  LEFT JOIN Gps B ON a.DevId = B.PDAID  LEFT JOIN DeviceType C ON a.DevType = c.ID  where BMDM in (SELECT BMDM from childtable UNION all SELECT '" + dtfrist.Rows[i1]["BMDM"].ToString() + "') GROUP By c.TypeName ");
                DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
                sqltext.Clear();
                json.Append(JSON.DatatableToJS(dt, "").ToString());
            }
            json.Append("]");
            context.Response.Write(json.ToString());
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