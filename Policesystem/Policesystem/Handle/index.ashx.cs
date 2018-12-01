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
    /// index 的摘要说明
    /// </summary>
    public class index : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();

            // context.Response.Cookies["BMDM"].Value = "331001000000";

            //HttpCookie cookie = new HttpCookie("cookieName");
            //cookie.Value = "331001000000";
            //HttpContext.Current.Response.Cookies.Add(cookie);

            // carouselEntity
            string carouselEntity = context.Request.Form["carouselEntity"];

            // HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
             // and[Time] >= GETDATE() - 2
            string BMDM = "331000000000";
            if (carouselEntity != null)
            {
                BMDM = carouselEntity;
            }
            switch (BMDM)
            {
                case "331000000000":
                    sqltext.Append("SELECT  a.DevType,[Time],COUNT(a.id) as 设备数量,COUNT(u.id) as 人数,SUM(FileSize)/1048576 as 文件大小,SUM(GFSCL) as 规范上传率,SUM(OnlineTime)/3600 as 在线总时长,SUM(HandleCnt) as 处理量,SUM(CXCNT) AS 查询量, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) 在线数 FROM [dbo].[StatsInfo_Yestorday_Today] a left JOIN Device d  on d.DevId = a.DevId   left JOIN ACL_USER  u  on u.JYBH = d.JYBH  where a.DevType in (1,2,3,4,5,6)   GROUP BY a.DevType,TIME ORDER BY a.DevType, [Time]");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT  a.DevType,[Time],COUNT(a.id) as 设备数量,COUNT(u.id) as 人数,SUM(FileSize)/1048576 as 文件大小,SUM(GFSCL) as 规范上传率,SUM(OnlineTime)/3600 as 在线总时长,SUM(HandleCnt) as 处理量,SUM(CXCNT) AS 查询量, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) 在线数 FROM [dbo].[StatsInfo_Yestorday_Today] a left JOIN Device d  on d.DevId = a.DevId   left JOIN ACL_USER  u  on u.JYBH = d.JYBH  where a.DevType in (1,2,3,4,5,6) and  a.BMDM in (SELECT BMDM FROM childtable)  GROUP BY a.DevType,TIME ORDER BY a.DevType, [Time]");
                    break;
                default:
                    sqltext.Append("SELECT  a.DevType,[Time],COUNT(a.id) as 设备数量,COUNT(u.id) as 人数,SUM(FileSize)/1048576 as 文件大小,SUM(GFSCL) as 规范上传率,SUM(OnlineTime)/3600 as 在线总时长,SUM(HandleCnt) as 处理量,SUM(CXCNT) AS 查询量, sum((CASE WHEN([OnlineTime] +[HandleCnt]) > 0 THEN 1 ELSE 0 END)) 在线数 FROM [dbo].[StatsInfo_Yestorday_Today] a left JOIN Device d  on d.DevId = a.DevId   left JOIN ACL_USER  u  on u.JYBH = d.JYBH  where a.DevType in (1,2,3,4,5,6)  and a.BMDM = '" + BMDM+"' GROUP BY a.DevType,TIME ORDER BY a.DevType, [Time]");
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