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
    /// getAlarmuser 的摘要说明
    /// </summary>
    public class getAlarmuser : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            StringBuilder sqltext1 = new StringBuilder();

            // context.Response.Cookies["BMDM"].Value = "331001000000";

            //HttpCookie cookie = new HttpCookie("cookieName");
            //cookie.Value = "331001000000";
            //HttpContext.Current.Response.Cookies.Add(cookie);

            string alarmindex = context.Request.Form["alarmindex"];
            int alarmdays = int.Parse(context.Request.Form["alarmdays"]);
            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];

            string BMDM = "331000000000";
            if (cookies != null)
            {
                BMDM = cookies["BMDM"];
            }

            switch (BMDM)
            {
                case "331000000000":
                    sqltext1.Append("SELECT top 1 gp.ID FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH where IsAlarm='1'  and al.XM <>'' and gp.QQSJ < GETDATE()-" + alarmdays + "  ORDER BY gp.ID desc");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sqltext1.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT top 1 gp.ID FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH where IsAlarm='1'  and  al.BMDM in (SELECT BMDM FROM childtable) and al.XM <>'' and gp.QQSJ < GETDATE()-" + alarmdays + "     ORDER BY gp.ID desc");
                    break;
                default:
                    sqltext1.Append("SELECT top 1 gp.ID FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH where IsAlarm='1'  and al.BMDM='" + BMDM + "' and al.XM <>'' and gp.QQSJ < GETDATE()-" + alarmdays + "   ORDER BY gp.ID desc");
                    break;
            }
            DataTable dt1 = SQLHelper.ExecuteRead(CommandType.Text, sqltext1.ToString(), "DB");
            for (int i = 0; i < dt1.Rows.Count; i++)
            {
                if (dt1.Rows[i][0].ToString() == alarmindex) {
                    alarmindex = "0";
                }
            }


                switch (BMDM)
            {
                case "331000000000":
                    sqltext.Append("SELECT top 50 gp.ID,al.XM,de.DevId,gp.QQSJ,REPLACE(en.BMMC,'台州市交通警察支队','') BMMC,dt.TypeName FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH LEFT JOIN Entity en on en.BMDM =de.BMDM  LEFT JOIN DeviceType dt on dt.id=de.DevType   where IsAlarm='1' and al.XM <>'' and gp.QQSJ < GETDATE()-" + alarmdays + " and gp.ID > " + alarmindex + "  ORDER BY gp.ID");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM ='" + BMDM + "' OR BMDM ='" + BMDM + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT top 50 gp.ID,al.XM,de.DevId,gp.QQSJ,replace(en.BMMC,'台州市交通警察支队','') BMMC,dt.TypeName FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH  LEFT JOIN Entity en on en.BMDM =de.BMDM  LEFT JOIN DeviceType dt on dt.id=de.DevType where IsAlarm='1'  and  al.BMDM in (SELECT BMDM FROM childtable) and al.XM <>'' and gp.QQSJ < GETDATE()-" + alarmdays + " and gp.ID > " + alarmindex + "    ORDER BY gp.ID");
                    break;
                default:
                    sqltext.Append("SELECT top 50 gp.ID,al.XM,de.DevId,gp.QQSJ,REPLACE(en.BMMC,'台州市交通警察支队','') BMMC,dt.TypeName FROM [dbo].[Gps] gp LEFT JOIN Device de on gp.PDAID=de.DevId LEFT JOIN ACL_USER al on de.JYBH = al.JYBH  LEFT JOIN Entity en on en.BMDM =de.BMDM  LEFT JOIN DeviceType dt on dt.id=de.DevType where IsAlarm='1'  and al.BMDM='" + BMDM+ "'  and al.XM <>''and gp.QQSJ < GETDATE()-" + alarmdays + "  and gp.ID > " + alarmindex + "  ORDER BY gp.ID");
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