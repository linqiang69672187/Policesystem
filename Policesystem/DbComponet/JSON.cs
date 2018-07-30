using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DbComponent
{
    public class JSON
    {


        #region 格式化DATABALE2JSON封装
        public static StringBuilder DatatableToJson(DataTable layerdr, string Title)
        {
            StringBuilder retJson = new StringBuilder();
            if (layerdr.Rows.Count == 0)
            {
                return retJson.Append("{\"result\":\""+layerdr.Rows.Count+"\",\"r\":\"1\"}");

            }
            retJson.Append("{\"r\":\"0\",");

            retJson.Append('"');
            retJson.Append("result");
            retJson.Append('"');
            retJson.Append(":[");

            try
            {
                for (int i = 0; i < layerdr.Rows.Count; i++)
                {
                    retJson.Append("{");

                    for (int h = 0; h < layerdr.Columns.Count; h++)
                    {
                        if (h != 0) retJson.Append(',');
                        retJson.Append('"');
                        retJson.Append(layerdr.Columns[h].ColumnName);
                        retJson.Append('"');
                        retJson.Append(":");
                        retJson.Append('"');
                        retJson.Append(layerdr.Rows[i][layerdr.Columns[h].ColumnName].ToString().TrimEnd());
                        retJson.Append('"');
                    }




                    retJson.Append("},");
                }


            }
            catch (Exception ex)
            {

                ex.ToString();
            }
            retJson.Remove(retJson.Length - 1, 1);
            retJson.Append("]}");

            return retJson;
        }
        #endregion


        #region 格式化DATABALE2JSONjs树形使用封装
        public static StringBuilder DatatableToJstree(DataTable layerdr, string Title)
        {
            StringBuilder retJson = new StringBuilder();
            if (layerdr.Rows.Count == 0)
            {
                return retJson.Append("{\"result\":\"获取失败\",\"r\":\"1\"}");

            }
            retJson.Append("{\"r\":\"0\",");

            retJson.Append('"');
            retJson.Append("result");
            retJson.Append('"');
            retJson.Append(":[");

            try
            {
                for (int i = 0; i < layerdr.Rows.Count; i++)
                {
                    retJson.Append("{");

                    for (int h = 0; h < layerdr.Columns.Count; h++)
                    {
                        if (h != 0) retJson.Append(',');
                        retJson.Append('"');
                        retJson.Append(layerdr.Columns[h].ColumnName);
                        retJson.Append('"');
                        retJson.Append(":");
                        retJson.Append('"');
                        retJson.Append((layerdr.Rows[i][layerdr.Columns[h].ColumnName].ToString().TrimEnd() == "0") ? "#" : (layerdr.Rows[i][layerdr.Columns[h].ColumnName].ToString().TrimEnd()));
                        retJson.Append('"');
                    }




                    retJson.Append("},");
                }


            }
            catch (Exception ex)
            {

                ex.ToString();
            }
            retJson.Remove(retJson.Length - 1, 1);
            retJson.Append("]}");

            return retJson;
        }
        #endregion


        #region 格式化DATABALE2JSON封装
        public static StringBuilder DatatableToDatatableJS(DataTable layerdr, string Title)
        {
            StringBuilder retJson = new StringBuilder();
          

            retJson.Append("{\"");
            retJson.Append("data");
            retJson.Append('"');
            retJson.Append(":[");

            try
            {
                for (int i = 0; i < layerdr.Rows.Count; i++)
                {
                    if (i != 0) retJson.Append(',');
                    retJson.Append("{");

                    for (int h = 0; h < layerdr.Columns.Count; h++)
                    {
                        if (h != 0) retJson.Append(',');
                        retJson.Append('"');
                        retJson.Append(layerdr.Columns[h].ColumnName);
                        retJson.Append('"');
                        retJson.Append(":");
                        retJson.Append('"');
                        retJson.Append(layerdr.Rows[i][layerdr.Columns[h].ColumnName].ToString().TrimEnd());
                        retJson.Append('"');
                    }




                    retJson.Append("}");
                }


            }
            catch (Exception ex)
            {

                ex.ToString();
            }

            retJson.Append("],\"title\":\"" + Title + "\"}");

            return retJson;
        }
        #endregion


        #region 格式化DATABALE2JSON封装
        public static StringBuilder DatatableToJS(DataTable layerdr, string Title)
        {
            StringBuilder retJson = new StringBuilder();


            retJson.Append("\"");
            retJson.Append("data");
            retJson.Append('"');
            retJson.Append(":[");

            try
            {
                for (int i = 0; i < layerdr.Rows.Count; i++)
                {
                    if (i != 0) retJson.Append(',');
                    retJson.Append("{");

                    for (int h = 0; h < layerdr.Columns.Count; h++)
                    {
                        if (h != 0) retJson.Append(',');
                        retJson.Append('"');
                        retJson.Append(layerdr.Columns[h].ColumnName);
                        retJson.Append('"');
                        retJson.Append(":");
                        retJson.Append('"');
                        retJson.Append(layerdr.Rows[i][layerdr.Columns[h].ColumnName].ToString().TrimEnd());
                        retJson.Append('"');
                    }




                    retJson.Append("}");
                }


            }
            catch (Exception ex)
            {

                ex.ToString();
            }

            retJson.Append("]}");

            return retJson;
        }
        #endregion

    }

}
