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
    /// entitymanage 的摘要说明
    /// </summary>
    public class entitymanage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string ssdd = context.Request.Form["ssdd"];
            StringBuilder sqltext = new StringBuilder();

            search = (search == "") ? " " : "  and et1.BMMC like '%" + search + "%'";
            switch (ssdd)
            {
                case "all":
                    sqltext.Append("SELECT et1.BMMC,et2.BMMC as SJMC,et1.LXDZ,et1.FZR,et1.BMDM,et1.JKYH,et1.FY,et1.FYJG,et1.LXDH,CONVERT(varchar(10),et1.Lo)+','+CONVERT(varchar(10),et1.La) as position from [Entity] et1 left join Entity et2 on et1.SJBM =et2.BMDM where et1.[SJBM]  = '331000000000'" + search+"  order by et1.sort ");
                    break;
                default:
                    sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT et1.BMMC,et2.BMMC as SJMC,et1.LXDZ,et1.FZR,et1.BMDM,et1.JKYH,et1.FY,et1.FYJG,et1.LXDH,CONVERT(varchar(10),et1.Lo)+','+CONVERT(varchar(10),et1.La) as position  from [Entity] et1  left join Entity et2 on et1.SJBM =et2.BMDM  where et1.[BMDM]  in (select BMDM from childtable) " + search+"  order by et1.sort ");
                    break;
            }

            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
            context.Response.Write(JSON.DatatableToDatatableJS(dt, "table"));
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