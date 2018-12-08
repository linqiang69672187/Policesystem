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
    /// indexconfig 的摘要说明
    /// </summary>
    public class indexconfig : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            StringBuilder sqltext = new StringBuilder();
            sqltext.Append("SELECT * FROM [IndexConfigs] where id in (1,2,3,4,7)");
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