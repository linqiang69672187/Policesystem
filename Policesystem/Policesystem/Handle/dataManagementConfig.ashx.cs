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
            HttpCookie cookies = new HttpCookie("cookieName_value");
            cookies.Expires = DateTime.Now.AddDays(99);

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
            sqltext.Append("select * from IndexConfigs where ID=5");
            DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
            context.Response.Write(JSON.DatatableToJson(dt, ""));


            if (dt.Rows.Count > 0) {
                cookies["usedvalue"] = dt.Rows[0][2].ToString().Split('|')[0];
                cookies["onlinevalue"] = dt.Rows[0][2].ToString().Split('|')[1];

            }
            else
            {
                cookies["usedvalue"] ="10";
                cookies["onlinevalue"] = "30";

            }

            HttpContext.Current.Response.Cookies.Add(cookies);

            return;

        update: ;
            string val = context.Request.Form["val"];
            sqltext.Append("if exists (select * from IndexConfigs where id=5) begin update IndexConfigs set val='"+val+"' where id=5 end else begin insert into IndexConfigs (val,id) values ('"+val+"',5) end");

            SQLHelper.ExecuteNonQuery(CommandType.Text, sqltext.ToString());

            cookies["usedvalue"] =  val.Split('|')[0];
            cookies["onlinevalue"] = val.Split('|')[1];

    
            HttpContext.Current.Response.Cookies.Add(cookies);

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