using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;

namespace DbComponent
{
    public class SQLHelper
    {
        
        private static String connectionString = System.Web.Configuration.WebConfigurationManager.AppSettings["m_connectionString"];

        #region ExecuteNonQuery封装

        public static int ExecuteNonQuery(CommandType cmdtype, string cmdText, params SqlParameter[] Parameters)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
         {
             conn.Open();
             using (SqlCommand cmd = new SqlCommand())
             {
                 cmd.CommandText = cmdText;
                 cmd.CommandType = cmdtype;
                 cmd.Connection = conn;
                 foreach (SqlParameter Parameter in Parameters)
                 {
                     cmd.Parameters.Add(Parameter);
                }
                 return cmd.ExecuteNonQuery();
              }
         }
          
        }
        #endregion

        #region ExecuteScalar封装
        public static object ExecuteScalar(CommandType cmdtype, string cmdText, params SqlParameter[] Parameters)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.CommandText = cmdText;
                    cmd.CommandType = cmdtype;
                    cmd.Connection = conn;

                    foreach (SqlParameter Parameter in Parameters)
                    {
                        cmd.Parameters.Add(Parameter);
                    }
                    return cmd.ExecuteScalar();
                }
            }

        }
        #endregion

        #region ExecuteScalar封装
        public static object ExecuteScalarStrProc(CommandType cmdtype, string StoredProcedureName, params SqlParameter[] Parameters)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand())
                {                    
                    cmd.Connection = conn;
                    cmd.CommandType = cmdtype;
                    cmd.CommandText = StoredProcedureName;

                    foreach (SqlParameter Parameter in Parameters)
                    {
                        cmd.Parameters.Add(Parameter);
                    }
                    return cmd.ExecuteScalar();
                }
            }
        }
        #endregion
        
        #region ExecuteRead封装
        public static DataTable ExecuteRead(CommandType cmdtype, string cmdText, int startRowIndex, int maximumRows,string tableName, params SqlParameter[] Parameters)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                SqlDataAdapter dr = new SqlDataAdapter(cmdText, conn);
                DataSet ds = new DataSet();
                foreach (SqlParameter Parameter in Parameters)
                {
                      dr.SelectCommand.Parameters.Add(Parameter); 
                }
                dr.Fill(ds, startRowIndex, maximumRows, tableName);
                return ds.Tables[0];
            }
        }
        #endregion

        #region ExecuteReadStrProc封装
        public static DataTable ExecuteReadStrProc(CommandType cmdtype, string StoredProcedureName, int startRowIndex, int maximumRows, string tableName, params SqlParameter[] p)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter();
                DataSet ds = new DataSet();
                if (p.Length > 0)
                {
                    da.SelectCommand = new SqlCommand();
                    da.SelectCommand.Connection = conn;
                    da.SelectCommand.CommandText = StoredProcedureName;
                    da.SelectCommand.CommandType = cmdtype;
                    for (int i = 0; i < p.Length; i++)
                    {
                        da.SelectCommand.Parameters.Add(p[i]);
                    }
                    da.Fill(ds, startRowIndex, maximumRows, tableName);                    
                }
                return ds.Tables[0];                                 
            }
        }
        #endregion


        /// <summary>读取数据库所有表，不分页。存储过程或者SQL语句
   
        /// <example>For example:
        /// <code>
        /// 
        /// 
        /// </code>
        /// 返回 DATATABLE.
        /// </example>
        /// </summary>
        #region ExecuteReadStrProc封装，不分页
        public static DataTable ExecuteReadStrProc(CommandType cmdtype, string StoredProcedureName,string tableName, params SqlParameter[] p)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                SqlDataAdapter da = new SqlDataAdapter();
                DataSet ds = new DataSet();
                if (p.Length > 0)
                {
                    da.SelectCommand = new SqlCommand();
                    da.SelectCommand.Connection = conn;
                    da.SelectCommand.CommandText = StoredProcedureName;
                    da.SelectCommand.CommandType = cmdtype;
                    for (int i = 0; i < p.Length; i++)
                    {
                        da.SelectCommand.Parameters.Add(p[i]);
                    }
                    da.Fill(ds, tableName);
                }
                return ds.Tables[0];
            }
        }
        #endregion

        #region ExecuteRead封装
        public static DataTable ExecuteRead(CommandType cmdtype, string cmdText, string tableName, params SqlParameter[] Parameters)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                SqlDataAdapter dr = new SqlDataAdapter(cmdText,conn);
                DataSet ds = new DataSet();
                foreach (SqlParameter Parameter in Parameters)
                {
                    dr.SelectCommand.Parameters.Add(Parameter);
                }
                dr.Fill(ds, tableName);
                return ds.Tables[0];
             }
        }
        #endregion


        public static DataTable ExcelToDS(string Path)
        {
           // string strConn = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
           // OleDbConnection conn = new OleDbConnection(strConn);

            ExcelFile excelFile = new ExcelFile();
       
            excelFile.LoadXls(Path);
            ExcelWorksheet sheet = excelFile.Worksheets[0];

            DataTable specificRangeData = sheet.CreateDataTable(ColumnTypeResolution.Auto);
            return specificRangeData;

            string strConn = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
            OleDbConnection conn = new OleDbConnection(strConn);
            conn.Open();
            DataTable schemaTable = conn.GetOleDbSchemaTable(System.Data.OleDb.OleDbSchemaGuid.Tables, null);
            string tableName = schemaTable.Rows[0][2].ToString().Trim(); 

            string strExcel = "";
            OleDbDataAdapter myCommand = null;
            DataSet ds = null;
            strExcel = "select * from [" + tableName + "$]";
            myCommand = new OleDbDataAdapter(strExcel, strConn);
            ds = new DataSet();
            myCommand.Fill(ds, "table1");
            conn.Close();
            return ds.Tables[0];
        }



    }
    
}
