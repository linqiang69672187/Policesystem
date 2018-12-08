using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// saveindexconfig 的摘要说明
    /// </summary>
    public class saveindexconfig : IHttpHandler
    {


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string Row1 = context.Request.Form["Row1"];
            string val1 = context.Request.Form["val1"];
            string Row2 = context.Request.Form["Row2"];
            string val2 = context.Request.Form["val2"];
            string Row3 = context.Request.Form["Row3"];
            string val3 = context.Request.Form["val3"];
            string Row4 = context.Request.Form["Row4"];
            string val4 = context.Request.Form["val4"];
            string val5 = context.Request.Form["val5"];

            SqlParameter[] sp = new SqlParameter[3];
            sp[0] = new SqlParameter("@id", 1);
            sp[1] = new SqlParameter("@DevType", Row1);
            sp[2] = new SqlParameter("@val", val1);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp);

            SqlParameter[] sp1 = new SqlParameter[3];
            sp1[0] = new SqlParameter("@id", 2);
            sp1[1] = new SqlParameter("@DevType", Row2);
            sp1[2] = new SqlParameter("@val", val2);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp1);

            SqlParameter[] sp2 = new SqlParameter[3];
            sp2[0] = new SqlParameter("@id", 3);
            sp2[1] = new SqlParameter("@DevType", Row3);
            sp2[2] = new SqlParameter("@val", val3);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp2);

            SqlParameter[] sp4 = new SqlParameter[3];
            sp4[0] = new SqlParameter("@id", 4);
            sp4[1] = new SqlParameter("@DevType", Row4);
            sp4[2] = new SqlParameter("@val", val4);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set DevType=@DevType,val=@val where id = @id", sp4);

            SqlParameter[] sp5 = new SqlParameter[2];
            sp5[0] = new SqlParameter("@id", 7);
            sp5[1] = new SqlParameter("@val", val5);
            SQLHelper.ExecuteNonQuery(CommandType.Text, "update IndexConfigs set val=@val where id = @id", sp5);


            try
            {
                string strHostName = Dns.GetHostName(); //得到本机的主机名 
                 //IPHostEntry ipEntry = Dns.GetHostEntry(strHostName); //取得本机IP 
                 //string IP = TOOL.Login.IP;
                string IP ="";
                HttpCookie cookies = HttpContext.Current.Request.Cookies["cookieName"];
                string JYBH = "331000000000";
                if (cookies != null)
                {
                    JYBH = cookies["JYBH"];
                }

                string bz = "ID:1," + val1 + "ID:2" + val2 + "ID:3" + val3 + "ID:4" + val4;

                SqlParameter[] sp3 = new SqlParameter[7];
                sp3[0] = new SqlParameter("@JYBH", JYBH);
                sp3[1] = new SqlParameter("@Module", "07");
                sp3[2] = new SqlParameter("@OperContent", "13");
                sp3[3] = new SqlParameter("@IpAddr", IP);
                sp3[4] = new SqlParameter("@LogTime", DateTime.Now.ToString());
                sp3[5] = new SqlParameter("@BZ", bz);
                sp3[6] = new SqlParameter("@OptObject", "参数设置");

                SQLHelper.ExecuteNonQuery(CommandType.Text, "INSERT OperationLog (JYBH,Module,OperContent,IpAddr,LogTime,BZ,OptObject) VALUES (@JYBH,@Module,@OperContent,@IpAddr,@LogTime,@BZ,@OptObject)", sp3);

            }
            catch ( Exception ex)
            {

            }


          



            context.Response.Write("1");
        }
        private static string GetWebClientIp() {
            var ip = GetWebRemoteIp();
            foreach (var hostAddress in Dns.GetHostAddresses(ip))
            {
                if (hostAddress.AddressFamily == AddressFamily.InterNetwork) return hostAddress.ToString();
            }
            return string.Empty;
        }
        private static string GetWebRemoteIp() {
            return HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
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