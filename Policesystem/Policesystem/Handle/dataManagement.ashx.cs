using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// dataManagement 的摘要说明
    /// </summary>
    public class dataManagement : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string hbbegintime = context.Request.Form["hbbegintime"];
            string hbendtime = context.Request.Form["hbendtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string requesttype = context.Request.Form["requesttype"];
            StringBuilder sqltext = new StringBuilder();
            switch (requesttype)
            {
                case "查询汇总":
                    goto cxhz;
                    break;
                default:
                    goto end;
                    break;
            }

        cxhz:;
            if (ssdd == "all")
            {
                sqltext.Append("SELECT  WHERE e.BMJC  is NOT NULL");
            }




        end:;

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