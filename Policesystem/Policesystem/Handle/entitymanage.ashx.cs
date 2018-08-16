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
            string sszd = context.Request.Form["sszd"];

            StringBuilder sqltext = new StringBuilder();

            switch (ssdd)
            {
                case "all":
                    sqltext.Append("SELECT * from [Entity] a where [SJBM]  = '331000000000'");
                    break;
                default:
                    sqltext.Append("SELECT * from [Entity] a where [SJBM]  = '331000000000'");
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