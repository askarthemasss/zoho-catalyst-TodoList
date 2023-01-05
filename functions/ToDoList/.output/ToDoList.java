import java.util.logging.Logger;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Level;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.catalyst.advanced.CatalystAdvancedIOHandler;
import com.zc.component.object.ZCObject;
import com.zc.component.object.ZCRowObject;
import com.zc.component.object.ZCTable;
import com.zc.component.zcql.ZCQL;

public class ToDoList implements CatalystAdvancedIOHandler {

	// METHOD Name Variables
	private static final String GET = "GET";
	private static final String POST = "POST";
	private static final String DELETE = "DELETE";

	// reponse Object
	private JSONObject responseData = new JSONObject();

	// Logger
	private static final Logger LOGGER = Logger.getLogger(ToDoList.class.getName());
	
	@Override
    public void runner(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TRY
		try {
			// String name = (String) request.getParameter("name");
			// LOGGER.log(Level.INFO, "Hello "+name);
			// response.setStatus(200);

			// URL & Method
			String uri = request.getRequestURI();
			String method = request.getMethod();

			// System.out.println(uri);
			// System.out.println(request.getParameter("page"));
			// System.out.println(ZCQL.getInstance().executeQuery("SELECT COUNT(ROWID) FROM TodoItems").get(0).get("TodoItems", "ROWID"));

			// System.out.println(ZCQL.getInstance().executeQuery("SELECT ROWID,Notes FROM TodoItems LIMIT 0,4").get(0));

			// ==================== GET =================
			// GET method gets data from the TodoItems table in the Data Store.
			if(method.equals(GET) && uri.equals("/all")){

				// ============== Resquest Format =============
				// http://localhost:3000/server/ToDoList/all?page=1&perPage=2

				// For hasMore - boolean
				Integer page = Integer.parseInt(request.getParameter("page"));
				Integer perPage = Integer.parseInt(request.getParameter("perPage"));

				Integer totalTodos = Integer.parseInt(ZCQL.getInstance().executeQuery("SELECT COUNT(ROWID) FROM TodoItems").get(0).get("TodoItems", "ROWID").toString());

				Boolean hasMore = totalTodos > page * perPage;

				// todoItems - ArrayList of HashMap
				ArrayList<HashMap<String, String>> todoItems = new ArrayList<>();
				
				// Fetching and Adding Notes to ArrayList
				// Query with LIMIT, page & perPage
				// LIMIT 1,4 => select 4 records from index 1 (record nos => 2,3,4,5)

				String query = String.format("SELECT ROWID,Notes FROM TodoItems LIMIT %d,%d",(page-1) * perPage + 1, perPage);
				// String query = "SELECT ROWID,Notes FROM TodoItems LIMIT 1,4";

				ZCQL.getInstance().executeQuery(query).forEach(row -> {
					todoItems.add(new HashMap<String, String>() {
						{
							put("id", row.get("TodoItems", "ROWID").toString());
							put("notes", row.get("TodoItems", "Notes").toString());
						}
					});
				});

				// Sending Response
				/*
					========= responseData Format ==========
					{
						"status" : "success",
						"data" : {
							"hasMore" : true,
							"todoItems" : [
								{"id" : "1", "notes" : "Note 1"},
								{"id" : "2", "notes" : "Note 2"},
								{"id" : "3", "notes" : "Note 3"}
							]
						}
					}
					========================================
				*/
				response.setStatus(200);
				responseData.put("status", "success");
				responseData.put("data", new JSONObject(){
					{
						put("hasMore",hasMore);
						put("todoItems",todoItems);
					}
				});
			}

			// ==================== POST =================
			// POST method sends data to persist in the TodoItems table in the Data Store
			else if(method.equals(POST) && uri.equals("/add")) {

				// ============== Resquest Format =============
				// http://localhost:3000/server/ToDoList/add

				// Parse body as JSON
				JSONParser jsonParser = new JSONParser();
				ServletInputStream requestBody = request.getInputStream();

				JSONObject jsonObject = (JSONObject) jsonParser.parse(new InputStreamReader(requestBody,"UTF-8"));

				// request body
				String notes = jsonObject.get("notes").toString();
				
				// Create Row and set values
				ZCRowObject row = ZCRowObject.getInstance();
				row.set("Notes", notes);

				ZCRowObject todoItem = ZCObject.getInstance().getTable("TodoItems").insertRow(row);

				// Sending Response
				/*
					=========== Response Format ===========
					{
						"data": {
							"todoItem": {
							"notes": "Note 2 from RESTClient",
							"id": "3040000000019025"
							}
						},
						"status": "success"
					}
					=======================================
				 */
				response.setStatus(200);
				responseData.put("status", "success");
				responseData.put("data", new JSONObject(){
					{
						put("todoItem",new JSONObject(){
							{
								put("id",todoItem.get("ROWID").toString());
								put("notes",todoItem.get("Notes").toString());		
							}
						});
					}
				});
			}

			// ==================== DELETE =================
			// Delete method deletes the selected items from the Data Store
			else if(method.equals(DELETE)){
				// ROWID of the Item
				// System.out.println(uri.substring(1));

				// ============== Resquest Format =============
				// http://localhost:3000/server/ToDoList/3040000000021004
				
				// Create Table Instance
				ZCTable table = ZCObject.getInstance().getTable("ToDOItems");

				// Delete row
				table.deleteRow(Long.parseLong(uri.substring(1)));

				// Sending Response
				/*
					=========== Response Format ===========
					{
						"data": {
							"todoItem": {
							"id": "3040000000021004"
							}
						},
						"status": "success"
					}
					=======================================
				 */
				response.setStatus(200);
				responseData.put("status", "success");
				responseData.put("data", new JSONObject(){
					{
						put("todoItem", new JSONObject() {
							{
								put("id", uri.substring(1));
							}
						});
					}
				});
			}

			// =========== 404 ===========
			else {
				response.setStatus(404);
				responseData.put("status", "failure");
				responseData.put("message", "Please check if the URL trying to access is a correct one");
			}
		}
		// CATCH
		catch(Exception e) {
			// LOGGER.log(Level.SEVERE,"Exception in ToDoList",e);
			// response.setStatus(500);

			//
			LOGGER.log(Level.SEVERE, "Exception in Main", e);
			responseData.put("status", "failure");
			responseData.put("message", "We're unable to process the request.");
		}

        // response.getWriter().write("Hello From ToDoList.java");

		//
		response.setContentType("application/json");
		response.getWriter().write(responseData.toString());
	}
	
}