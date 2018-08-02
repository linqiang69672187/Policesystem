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
    /// map 的摘要说明
    /// </summary>
    public class map : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string status = context.Request.Form["status"];
            string searchcondition = "";

            StringBuilder sqltext = new StringBuilder();
            searchcondition = (search == "") ? " and  IsOnline<>'' " : " and IsOnline<>''  and(de.[DevId] like '%" + search + "%' or de.PlateNumber like '%" + search + "%' or de.Contacts like  '%" + search + "%')";

            if (type == "0") //人员
            {
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMJC  is NOT NULL ORDER BY u.JYBH");
                    }
                    else
                    {
                        sqltext.Append("SELECT  g.IsOnline, u.XM,d.DevType,u.BMDM,e.BMJC,g.OnlineTime,d.DevId,u.JYBH FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on U.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId WHERE e.BMJC and g.IsOnline = " + status + "  is NOT NULL ORDER BY u.JYBH");

                    }
                    searchcondition = (search == "") ? " " : "  and(u.[JYBH] like '%" + search + "%' or u.XM like '%" + search + "%')";

                    goto end;
                }
            }
           else
            {
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId  where de.[DevType] =" + type + searchcondition );
                    }
                    else
                    {
                        sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + " and gps.IsOnline = '" + status + "'" + searchcondition  );

                    }
                    goto end;
                }
                if (sszd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + "  and de.EntityId in (select ID from childtable)" + searchcondition );
                    }
                    else
                    {
                        sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId where de.[DevType] =" + type + "  and gps.IsOnline = '" + status + "'  and de.EntityId in (select ID from childtable)" + searchcondition );

                    }
                    goto end;
                }
                if (status == "all")
                {
                    sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM Gps as gps right join Device as de on de.DevId = gps.PDAID  where de.[DevType] =" + type + " and [EntityId] =" + Convert.ToInt16(sszd) + searchcondition );
                }
                else
                {
                    sqltext.Append("SELECT [HandleCnt],[OnlineTime],[IsOnline],[PlateNumber],[Contacts],de.DevId as PDAID,de.EntityId,de.[Cartype],de.[IMEI],de.[UserNum] FROM Gps as gps right join Device as de on de.DevId = gps.PDAID  where de.[DevType] =" + type + "and gps.IsOnline = '" + status + "'  and [EntityId] =" + Convert.ToInt16(sszd) + searchcondition );
                }
            }
          
        end:


            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToJson(dt, ""));
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