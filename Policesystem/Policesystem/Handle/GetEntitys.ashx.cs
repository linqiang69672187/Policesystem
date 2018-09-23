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
            context.Response.Cookies["BMDM"].Value = "331001000000";
            switch (requesttype)
            {
                case "":
                case null://所有大队
                    sqltext.Append("SELECT BMJC,BMDM,SJBM from [Entity] a where [SJBM]  = '331000000000' and BMMC like '台州市交通警察支队直属%' union all select BMJC,BMDM,SJBM from  [Entity] b where b.SJBM in (SELECT BMDM from [Entity]  where [SJBM]  = '331000000000' and BMMC like '台州市交通警察支队直属%')");
                    break;
                case "所有单位":
                    sqltext.Append("SELECT BMJC,BMDM,SJBM,BMMC from [Entity] a where [SJBM]  = '331000000000' ");
                    break;
                default:
                    break;
            }
          


            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, context.Request.Cookies["BMDM"].Value));
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