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
    /// getRolevalue 的摘要说明
    /// </summary>
    public class getRolevalue : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
            string JYBH = "000570";
            if (cookies != null)
            {
                JYBH = cookies["JYBH"];
            }
            StringBuilder sqltext = new StringBuilder();
            sqltext.Append("SELECT ro.Power FROM [ACL_USER] al LEFT JOIN Role ro on ro.ID = al.JSID where al.JYBH='"+ JYBH + "'");
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");

            context.Response.Write(JSON.DatatableToDatatableJS(dt, "1"));

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