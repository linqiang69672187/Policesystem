using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace DbComponent
{
    public class login
    {


        #region 用户登陆
        public static int loginin(string username, string pwd)
        {
          
            return int.Parse(SQLHelper.ExecuteScalar(CommandType.Text, "select count(*) from Admin where [Username] =@username and [Password]=@pwd ", new SqlParameter("username", username), new SqlParameter("pwd", pwd)).ToString());
        }
        #endregion
       
    }
}
