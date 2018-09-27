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
    /// GetEntitys 的摘要说明
    /// </summary>
    public class GetEntitys : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string requesttype = context.Request.Form["requesttype"];
            StringBuilder sqltext = new StringBuilder();
            string title= "331000000000";
            if (context.Response.Cookies["BMDM"].Value !=null)
            {
                title = context.Response.Cookies["BMDM"].Value;
            }
            
    
            switch (requesttype)
            {
                case "":
                case null://所有大队
                    sqltext.Append("SELECT BMJC,BMDM,SJBM from [Entity] a where [SJBM]  = '331000000000' and [BMJC] IS NOT NULL AND BMJC <> '' union all select BMJC,BMDM,SJBM from  [Entity] b where b.SJBM in (SELECT BMDM from [Entity]  where [SJBM]  = '331000000000' and   [BMJC] IS NOT NULL AND BMJC <> '')");
                    break;
                case "所有单位":
                    sqltext.Append("SELECT BMJC,BMDM,SJBM,BMMC from [Entity] a where [SJBM]  = '331000000000' ");
                    break;
                default:
                    break;
            }
          


            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, title));
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