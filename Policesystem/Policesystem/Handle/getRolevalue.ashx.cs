using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// getRolevalue 的摘要说明
    /// </summary>
    public class getRolevalue : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
            string JYBH = "331000000000";
            if (cookies != null)
            {
                JYBH = cookies["JYBH"];
            }
            StringBuilder sqltext = new StringBuilder();
            sqltext.Append("SELECT BMJC,BMDM,SJBM from [Entity] a where [SJBM]  = '331000000000' and [BMJC] IS NOT NULL AND BMJC <> '' union all select BMJC,BMDM,SJBM from  [Entity] b where b.SJBM in (SELECT BMDM from [Entity]  where [SJBM]  = '331000000000' and   [BMJC] IS NOT NULL AND BMJC <> '')");

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