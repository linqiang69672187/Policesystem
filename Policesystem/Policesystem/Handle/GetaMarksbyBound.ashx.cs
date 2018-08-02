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
    /// GetaMarksbyBound 的摘要说明
    /// </summary>
    public class GetaMarksbyBound : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string bounds = context.Request.Form["bounds"];
            string[] arry = bounds.Split(new char[1] { ',' });
            double Llongitu = Convert.ToDouble(arry[0]);
            double Llati = Convert.ToDouble(arry[1]);
            double Rlongitu = Convert.ToDouble(arry[2]);
            double Rlati = Convert.ToDouble(arry[3]);

            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string status = context.Request.Form["status"];
            string searchcondition = "";
            string typesql;
            //"SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,de.Contacts,de.Tel,et.Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber] FROM [Gps] as gps left join Device de on gps.PDAID = de.DevId left join  Entity et  on et.ID = de.EntityId where  de.[DevType] <> '' and  gps.La <" + Rlongitu + " and gps.La >" + Llongitu + " and gps.Lo <" + Rlati + "  and gps.Lo >" + Llati
            if (type == "0")
            {
                searchcondition = (search == "") ? " " : "   and (de.[DevId] like '%" + search + "%'  or u.XM  like  '%" + search + "%')";
                typesql = "";
            }
            else
            {
                typesql =  " and de.[DevType] = " + type;
            }

            StringBuilder sqltext = new StringBuilder();
      
            if (ssdd == "all")
            {
                if (status == "all")
                {
                    sqltext.Append("SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,u.XM as Contacts,u.SJ as Tel,et.BMJC as Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],u.JYBH,u.JYLX as [IdentityPosition] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId left join  Entity et  on et.BMDM = de.BMDM left join  ACL_USER u  on de.JYBH = u.JYBH where   IsOnline is not null " + typesql + searchcondition);
                }
                else
                {
                    sqltext.Append("SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,u.XM as Contacts,u.SJ as Tel,et.BMJC as Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],u.JYBH,u.JYLX as [IdentityPosition] FROM [Gps] gps right join Device de on gps.PDAID = de.DevId left join  Entity et  on et.BMDM = de.BMDM left join  ACL_USER u  on de.JYBH = u.JYBH where     gps.IsOnline = '" + status + "' " + typesql + searchcondition);

                }
                goto end;
            }

            if (sszd == "all")
            {
                if (status == "all")
                {
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID])  SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,de.Contacts,de.Tel1 as Tel,et.Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],de.[UserNum],de.[IdentityPosition]  FROM [Gps] gps right join Device de on gps.PDAID = de.DevId left join  Entity et  on et.ID = de.EntityId where de.[DevType] =" + type + "  and de.EntityId in (select ID from childtable)" + searchcondition);//+ " and  gps.La <" + Rlongitu + " and gps.La >" + Llongitu + " and gps.Lo <" + Rlati + "  and gps.Lo >" + Llati
                }
                else
                {
                    sqltext.Append("WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM  [Entity] A,childtable b where a.[ParentID] = b.[ID]) SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,de.Contacts,de.Tel1,et.Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],de.[UserNum],de.[IdentityPosition]  FROM [Gps] gps right join Device de on gps.PDAID = de.DevId left join  Entity et  on et.ID = de.EntityId where de.[DevType] =" + type + "  and gps.IsOnline = '" + status + "'  and de.EntityId in (select ID from childtable) " + searchcondition);

                }
                goto end;
            }
            if (status == "all")
            {
                sqltext.Append("SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,de.Contacts,de.Tel1,et.Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],de.[UserNum],de.[IdentityPosition]  FROM Gps as gps right join Device as de on de.DevId = gps.PDAID left join  Entity et  on et.ID = de.EntityId  where de.[DevType] =" + type + " and [EntityId] =" + Convert.ToInt16(sszd) + " " + searchcondition);
            }
            else
            {
                sqltext.Append("SELECT gps.[ID],[IsOnline],gps.Lo,gps.La,de.Contacts,de.Tel1,et.Name,de.[DevType],de.[Cartype],de.DevId,de.[PlateNumber],de.[IMEI],de.[UserNum],de.[IdentityPosition]  FROM Gps as gps right join Device as de on de.DevId = gps.PDAID  left join  Entity et  on et.ID = de.EntityId where de.[DevType] =" + type + " and gps.IsOnline = '" + status + "'  and [EntityId] =" + Convert.ToInt16(sszd) + " " + searchcondition);
            }


        end:
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "entity");



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