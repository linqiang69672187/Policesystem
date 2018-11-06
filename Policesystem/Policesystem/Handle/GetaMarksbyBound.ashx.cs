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

            StringBuilder sqltext = new StringBuilder();
            #region 选中设备类型为人员
            if (type == "0") //人员
            {
                searchcondition = (search == "") ? " " : "  and(u.[JYBH] like '%" + search + "%' or u.XM like '%" + search + "%')";
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE e.BMJC  is NOT NULL");
                    }
                    else
                    {
                        sqltext.Append("SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID WHERE   g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }

                    goto end;
                }

                if (sszd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID WHERE e.BMDM in (SELECT BMDM from childtable) and e.BMJC  is NOT NULL");
                    }
                    else
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID WHERE e.BMDM in (SELECT BMDM from childtable) and  g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }

                    goto end;
                }

                if (status == "all")
                {
                    sqltext.Append("SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID WHERE  e.BMDM ='" + sszd + "'  and e.BMJC  is NOT NULL");
                }
                else
                {
                    sqltext.Append("SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM [ACL_USER] U LEFT JOIN Device d  on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID WHERE e.BMDM ='" + sszd + "' and  g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                }

                goto end;


            }
            #endregion
            #region 选中设备类型为除人员以外的其它，对讲机、执法记录仪、警务通等8小件
            else
            {
                searchcondition = (search == "") ? " and d.DevType ='" + type + "'" : " and d.DevType ='" + type + "'" + "  and(d.DevId like '%" + search + "%' or u.XM like '%" + search + "%')";
                if (ssdd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE e.BMJC  is NOT NULL ");
                    }
                    else
                    {
                        sqltext.Append("SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE   g.IsOnline = " + status + " and e.BMJC is NOT NULL");

                    }

                    goto end;
                }

                if (sszd == "all")
                {
                    if (status == "all")
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE e.BMDM in (SELECT BMDM from childtable) and e.BMJC  is NOT NULL ");
                    }
                    else
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE e.BMDM in (SELECT BMDM from childtable) and  g.IsOnline = " + status + " and e.BMJC is NOT NULL ");

                    }

                    goto end;
                }

                if (status == "all")
                {
                    sqltext.Append("SELECT g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE  e.BMDM ='" + sszd + "'  and e.BMJC  is NOT NULL");
                }
                else
                {
                    sqltext.Append("SELECT  g.[ID],[IsOnline],g.Lo,g.La,u.XM as Contacts,u.SJ as Tel,e.BMJC as Name,d.[DevType],d.[Cartype],d.DevId,d.[PlateNumber],d.[IMEI],u.JYBH,pt.TypeName as [IdentityPosition] FROM Device d  LEFT JOIN [ACL_USER] U on U.JYBH = d.JYBH LEFT JOIN Entity e  on d.BMDM = e.BMDM LEFT JOIN Gps g on g.PDAID = d.DevId  LEFT JOIN PoliceType pt on u.JYLX = pt.ID  WHERE e.BMDM ='" + sszd + "' and  g.IsOnline = " + status + " and e.BMJC is NOT NULL ");

                }


            }
        #endregion

        end:
            sqltext.Append(searchcondition+" and g.la>90");
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