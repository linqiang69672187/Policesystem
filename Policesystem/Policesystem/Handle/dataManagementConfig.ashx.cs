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
    /// dataManagementConfig 的摘要说明
    /// </summary>
    public class dataManagementConfig : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string requesttype = context.Request.Form["requesttype"];
            StringBuilder sqltext = new StringBuilder();
            switch (requesttype)
            {
                case "Request":
                    goto Request;
                case "update":
                    goto update;
                default:
                    break;
            }



        Request:
            sqltext.Append("select * from IndexConfigs where ID=4");
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
            context.Response.Write(JSON.DatatableToJson(dt, ""));
            return;

        update: ;
            string val = context.Request.Form["val"];
            sqltext.Append("if exists (select * from IndexConfigs where id=4) begin update IndexConfigs set val='"+val+"' where id=4 end else begin insert into IndexConfigs (val,id) values ('"+val+"',4) end");

            SQLHelper.ExecuteNonQuery(CommandType.Text, sqltext.ToString());

            context.Response.Write("1");
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